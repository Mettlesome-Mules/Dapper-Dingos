'use strict';

/**
 * Module dependencies.
 */
 var fs = require('fs'),
 http = require('http'),
    // #DD added socketio require
    socketio = require('socket.io'),
    https = require('https'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
    mongoStore = require('connect-mongo')({
    	session: session
    }),
    flash = require('connect-flash'),
    config = require('./config'),
    consolidate = require('consolidate'),
    path = require('path'),
    mongoose = require('mongoose');





    module.exports = function (db) {
    // Initialize express app
    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
      console.log(path.resolve(modelPath), 'MONGOOSEPATH')
      require(path.resolve(modelPath));
    });

    // Setting application local variables
    //#DD: Removed Facebook client ID line here (unused strategy)
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
    	res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    	next();
    });

    // Should be placed before express.static
    app.use(compress({
    	filter: function (req, res) {
    		return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    	},
    	level: 9
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './app/views');

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
      } else if (process.env.NODE_ENV === 'production') {
      	app.locals.cache = 'memory';
      }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
    	extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    // Express MongoDB session storage
    app.use(session({
    	saveUninitialized: true,
    	resave: true,
    	secret: config.sessionSecret,
    	store: new mongoStore({
    		db: db.connection.db,
    		collection: config.sessionCollection
    	})
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages
    app.use(flash());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
    	require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
        	error: err.stack
        });
      });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
    	res.status(404).render('404', {
    		url: req.originalUrl,
    		error: 'Not Found'
    	});
    });

    if (process.env.NODE_ENV === 'secure') {
        // Log SSL usage
        console.log('Securely using https protocol');

        // Load SSL key and certificate
        var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

        // Create HTTPS Server
        var httpsServer = https.createServer({
        	key: privateKey,
        	cert: certificate
        }, app);

        // Return HTTPS server instance
        return httpsServer;
      }
    // #DD Attach Socket.io

    var server = http.createServer(app);
    var io = socketio.listen(server);

    app.set('socketio', io);
    app.set('server', server);


    //#DD IO function to receiev events and relay them to users
    io.sockets.on('connection', function (socket) {
      console.log('a user connected');

      var Room = mongoose.model('Room')
      //Start Rooms Code
      var Rooms =[];

      Room.findOne({ name: 'lobby'}, function(err, data){
       console.log('data', data)
       if (data === null){
         Room.create({ name: 'lobby'}, function (err, data) {
           if (err) {
             return console.error(err);
           }
           socket.join('lobby');
           socket.room = 'lobby'

           io.sockets.in(socket.room).emit('pastMessages', data.messages)
         });
       }else{
         console.log('Data:', data)
         socket.join('lobby');
         socket.room = 'lobby'

         io.sockets.in(socket.room).emit('pastMessages', data.messages)
       }
     })

      socket.on('sendRooms', function(){
        io.emit('sendingRooms', Rooms)
      })
      
      Room.find(function(err, data) {
        console.log('Data:', data)
        Rooms = data
      })

      

      socket.on('changeRoom', function(newroom){
        socket.leave(socket.room);
        socket.join(newroom);
        console.log('YOU HAVE JOINED ' + newroom)
        socket.room = newroom;

        Room.findOne({name: socket.room}, function(err,obj){          
          if(err){
            return err
          }
          io.sockets.in(socket.room).emit('pastMessages', obj.messages)
        })


        //make a call so that when messages are rendered



        // io.sockets.in(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
        // socket.emit('updaterooms', rooms, newroom);
      });


        socket.on('addToQueue', function (video, roomName, error) {
            console.log('config: express.js: addToQueue', video, roomName)
            console.log('sdh3e5rhscgssdDGSRGSGWERGWERGGGGGGGGGGGGGGGGGGGGGGGGGGG', video, roomName)
            Room.find({name: roomName}, function(error, rooms){
                    console.log('config-express.js', rooms)
                if(rooms.length){
                    delete video.$$hashKey;
                    rooms[0].queue.push(video)
                    rooms[0].save(function(error){
                        console.log(arguments)
                    })
                }
            })
            io.emit('addToQueue', video);
        });

      socket.on('newRoom', function (room) {
        //FIND A WAY TO NOT ADD ON RECLICK
        Room.find({ name: room.name }, function(err, data) {
          if (data){
            Room.create({ name: room.name }, function (err, data) {
              if (err) {
                console.log(err, 'ERROR:')
                return console.error(err);
              }
              socket.leave(socket.room);
              socket.join(data.name);
              socket.room = data.name
              io.sockets.in(socket.room).emit('pastMessages', data.messages)
            });
          }else {
            console.log('Already in db')
          }
        })

      });
      //End Rooms Code

      //Messages Start

      socket.on('onload', function () {
        Room.find({name: socket.room} , function (err, allMessages) {
          if (err) {
            return console.error(err)
          }
          io.emit('pastMessages', allMessages);
        });
      });


      socket.on('newMessage', function (message) {
        Room.findOne({name: socket.room}, function(err,obj){
          obj.messages.push(message)
          console.log('Messages in ' + obj.name + ': ' +obj.messages)
          obj.save(function(err, data) {
            if(err){
              console.log(err, 'ERR')
            }
            io.sockets.in(socket.room).emit('pastMessages', obj.messages)
            // Room.findOne({name: socket.room}, function(err,obj){
            //   // io.emit('pastMessages', obj.messages)
            //   console.log(obj.messages)
            // }
          })
        });

      	// console.log(message, 'before function');
       //  console.log(socket.room, 'SOCKET.ROOM')
      	// Message.create(message, function (err, message) {
      	// 	if (err) {
      	// 		return console.error(err);
      	// 	}
      	// 	console.log('posting to messages', message);
      	// 	Message.find(function (err, allMessages) {
      	// 		if (err) {
      	// 			return console.error(err);
      	// 		}
      	// 		console.log('finding all messages with newMessage');
      	// 		io.emit('pastMessages', allMessages);
      	// 	});
      	// });
      });

      //End Messages


        //socket function for starting video #DD
        socket.on('initiate', function (data) {
          console.log('relaying player start')
          io.emit('startVid');
        });

        //socket function for pausing #DD
        socket.on('paused', function (data) {
          console.log('relaying pause')
          io.emit('pauseVid');
        });
        //socket function for changing video #DD
        socket.on('changingUrl', function (url, error) {
          console.log('relaying new Url')
          io.emit('changeVid', url);
        });


        socket.on('getUsers', function () {
          Message.find(function (err, allMessages) {
            if (err) {
              return console.error(err)
            }
            console.log('finding all messages with GetUsers', allMessages)
            io.emit('pastMessages', allMessages);
          });
        });


      });
    // Return Express server instance
    return app;

  };