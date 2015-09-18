var webpack = require('webpack'),
    mongoose = require('mongoose'),
    express = require('express'),
    config = require('./webpack.config'),
    bodyParser = require('body-parser');

    mongoose.connect('mongodb://thinkful:thinkful@ds037814.mongolab.com:37814/jhumphrey');

var postSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    }
});

var Post = mongoose.model('Post', postSchema),
    app = express();

app.use(express.static(__dirname));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.set('view engine', 'html');

// Static Routes
app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});


// View
app.get('/', function(req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    });
});
// Create
app.post('/posts', function(req, res) {
    if (!req.body || !req.body.content) {
        return res.sendStatus(400);
    }

    var post = new Post({
        author: req.body.author,
        content: req.body.content,
        title: req.body.title
    });

    post.save()
        .then(function(post, err) {
            if (err) {
                return res.status(500).json({
                    error: 'Error Has Occured'
                });
            }
            res.status(201)
                .send(post);
        })
});

// Retrieve
app.get('/posts', function(req, res) {
    Post.find()
        .exec()
        .then(function(posts, err) {
            if (err) {
                return res.status(500).json({
                    error: 'Error Has Occured'
                });
            }
            res.json(posts);
        });
});

//Read
app.get('/posts/:id', function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(400);
    }
    Post.findOne({
            _id: req.params.id
        })
        .exec()
        .then(function(post, err) {
            if (err) {
                return res.status(500).json({
                    error: 'Error Has Occured'
                });
            }
            if (!post) {
                return res.sendStatus(404);
            }
            res.json(post);
        });
});

// Update
app.put('/posts/:id', function(req, res) {
    if (!req.body || !req.body.content || !req.params.id) {
        return res.sendStatus(400);
    }
    Post.findOneAndUpdate({
            _id: req.params.id
        }, {
            content: req.body.content,
            title: req.body.title,
            author: req.body.author
        })
        .exec()
        .then(function(post, err) {
            if (err) {
                return res.status(500).json({
                    error: 'Error Has Occured'
                });
            }
            if (!post) {
                return res.sendStatus(404);
            }
            res.json(post);
        });
});

// Delete
app.delete('/posts/:id', function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(400);
    }
    Post.findOneAndRemove({
            _id: req.params.id
        })
        .exec()
        .then(function(post) {
            if (!post) {
                return res.sendStatus(404);
            }
            res.sendStatus(200);
        });
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});