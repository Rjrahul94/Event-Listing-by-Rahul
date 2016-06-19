
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs      = require('ejs')


Schema = new mongoose.Schema({
    venue: String,
    about_event: String,
    date : String,
    Contact_No: String,
    email: String,
    charges : String,
    event_name : String,
    college_name : String,
    createdOn: Date
}),

Blog = mongoose.model('Blog', Schema);

mongoose.connect('mongodb://ank123:12345@ds013584.mlab.com:13584/akt');


var app = express()

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
})

app.get('/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Blog.find({}, function ( err, blogs ){
        if(!err && blogs){
            res.render('blogs.ejs',{
                data :  blogs
            })
        } else {
            console.log(err)
        }
    });
});

app.get('/admin', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Blog.find({}, function ( err, blogs ){
        if(!err && blogs){
            res.render('admin.ejs',{
                data :  blogs
            })
        } else {
            console.log(err)
        }
    });
});


app.get('/addblog', function(req, res){
    res.render('addPost.ejs')
})

app.get('/', function(req, res){
    Blog.find({}).limit(3).exec(function(err, blogs){
        if(!err && blogs){
            res.render('index.ejs',{
                data :  blogs
            })
        } else{
            console.log(err);
            res.status(500).send("something went wrong while fetching blog summary");
        }
    })
})

app.post('/api/addBlog', function (req, res) {
    var blog = new Blog(
        {
            date :  req.body.date,
            venue : req.body.venue,
            about_event: req.body.about_event,
            Contact_No : req.body.Contact_No,
            email : req.body.email,
            charges :req.body.charges,
            event_name : req.body.event_name,
            college_name :req.body.college_name,
            createdOn : Date.now()
        }
    );

    // http://mongoosejs.com/docs/api.html#model_Model-save
    blog.save(function (err, data) {
        if(!err && data){
            console.log('Data added successfully');
            res.redirect('/blogs')
        } else {
            res.json(500, {msg: 'Something went wrong' });
            console.log(err)
        }

    });
})

app.get('/api/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    User.remove({ category: 'music' }, function ( err ) {
        if(!err){
            console.log("User deleted successfully")
        } else{
            console.log(err)
        }
    });
})

app.get('/blog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('blogDetail.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });
} )

app.get('/editBlog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('editPost.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });

})

app.post('/api/editBlog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
            blog.date =  req.body.date,
            blog.venue = req.body.venue,
            blog.about_event = req.body.about_event,
            blog.Contact_No = req.body.Contact_No,
            blog.email = req.body.email,
            blog.charges = req.body.charges,
            blog.event_name = req.body.event_name,
            blog.college_name = req.body.college_name,
            createdOn = Date.now()
        // http://mongoosejs.com/docs/api.html#model_Model-save
        blog.save( function ( err, data ){
            if(!err && data){
                res.redirect('/blogs')
            } else {
                console.log(err)
            }

        });
    });
});

app.get('/api/deleteBlog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
        // http://mongoosejs.com/docs/api.html#model_Model.remove
        blog.remove( function ( err ){
           console.log("Blog deleted successfully")
            res.redirect('/admin')
        });
    });
});

app.listen(9090);
console.log('Magic happens on port 9090');

