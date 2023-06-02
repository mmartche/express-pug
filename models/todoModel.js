const mongoose = require('mongoose');
const slugify = require('slugify');

const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A todo must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A todo name must have less or equal then 40 characters'],
      minlength: [10, 'A todo name must have more or equal then 10 characters']
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTodo: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// todoSchema.index({ price: 1 });
todoSchema.index({ slug: 1 });
todoSchema.index({ startLocation: '2dsphere' });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
todoSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// todoSchema.pre('find', function(next) {
todoSchema.pre(/^find/, function (next) {
  this.find({ secretTodo: { $ne: true } });

  this.start = Date.now();
  next();
});

todoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

todoSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Todo = mongoose.model('Todo', todoSchema);

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });
module.exports = Todo;
