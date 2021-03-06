// Initializes the `custom-product` service on path `/custom-product`
const createService = require('./custom-product.class.js');
const hooks = require('./custom-product.hooks');
const filters = require('./custom-product.filters');

const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');

// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.

const custom_directory = '/home/software/github/openresty-lua/html/user-uploaded-images'
const fs = require('fs-blob-store');

const blobStorage = fs(custom_directory);



module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'uploads',
    paginate
  };

  // Initialize our service with any options it requires
  // app.use('/custom-product', createService(options));

  app.use('/uploads',

    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        next();
    },
    blobService({Model: blobStorage})
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploads');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
