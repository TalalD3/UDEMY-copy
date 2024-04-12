import Course from "../models/Course.js";

export const createCourse = async (req, res, next) => {
  let courses = await Course.find({});
  let id;
  if (courses.length > 0) {
    let last_course_array = courses.slice(-1);
    // console.log(last_course_array);
    let last_course = last_course_array[0];
    id = last_course.id + 1;
  } else {
    id = 1;
  }
  const {
    title,
    description,
    small_description,
    image,
    category,
    price,
    chapter
  } = req.body;


  if (!title || !description) {
    res.status(400);
    return next(new Error("title & description fields are required"));
  }

  try {
    const course = await Course.create({
      id,
      title,
      description,
      small_description,
      image,
      category,
      price,
      chapter
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
}