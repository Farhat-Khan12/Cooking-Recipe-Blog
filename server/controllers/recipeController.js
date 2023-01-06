require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
// GET Homepage
exports.homepage = async (req, res) => {
  try {
    limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const indian = await Recipe.find({ category: "Indian" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(limitNumber);
    const italian = await Recipe.find({ category: "Italian" }).limit(limitNumber);
    const chinese = await Recipe.find({ category: "Chinese" }).limit(limitNumber);
    const mexican = await Recipe.find({ category: "Mexican" }).limit(limitNumber);
    const indonesian = await Recipe.find({ category: "Indonesian" }).limit(limitNumber);
    const food = { latest, indian, american, italian, chinese, mexican, indonesian};
    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /categories 
exports.exploreCategories = async (req, res) => {
  try {
    limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /recipe
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog- Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /categories by Id
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//POST /search
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    //res.json(recipe);
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /explore-latest
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog- Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /random-recipe
exports.showRecipe = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    //res.json(recipe);
    res.render("random-recipe", {
      title: "Cooking Blog - Random Recipe",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//GET /submit-recipe
exports.submitRecipe = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render("submit-recipe", { title: "Cooking Blog - Submit Recipe", infoErrorsObj, infoSubmitObj});
};

//POST /submit-recipe
exports.submitRecipeOnPost = async (req, res) => {
  try{
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    
    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files were uploaded.');
    }
    else{
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./')+'/public/uploads/'+newImageName;
      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    await newRecipe.save();
    req.flash('infoSubmit','Recipe has been added.');
    res.redirect("/submit-recipe");
  }catch(error){
    req.flash('infoErrors',error);
    res.redirect('/submit-recipe');
  }
};


// async function insertData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name":"Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name":"Italian",
//                 "image": "italian-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image": "chinese-food.jpg"
//             },
//         ]);
//     }catch(error){
//         console.log(error);
//     }
// }

// insertData();

// async function insertRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "All American Carrot Cake",
//         description:
//           "1.Mix together the finely grated carrot, refined oil, castor sugar and brown sugar. 2.In another mixing bowl, mix flour, baking powder, nutmeg powder, cinnamon powder, vanilla essence and eggs. 3.In a different bowl, mix chopped walnuts and chopped pineapple. Keep aside. 4.Mix all of the above and dunk it in a baking dish. Let it bake for 45 min at 180C. 5.After baking, leave it in the oven for 15-20 minutes to rest. 6.Take out the cake and put it in the freezer to chill. 7.In another bowl, mix the quark cheese, mascarpone cheese, white butter and icing sugar and keep aside.8.Cut the carrot cake in the centre horizontally and fill it with quark cheese and icing sugar.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "140 gm brown sugar",
//           "140 ml oil refined",
//           "500 gm quark cheese",
//           "250 gm icing sugar",
//           "60 gm white butter",
//           "250 gm carrot",
//           "150 gm walnut",
//           "170 gm pineapple",
//           "3 eggs",
//           "11 gm cinnamon powder",
//           "12 gm nutmeg",
//           "10 gm baking powder",
//           "10 gm baking soda",
//           "Salt to taste",
//           "230 gm mascarpone cheese",
//         ],
//         category: "American",
//         image: "carrot-cake.jpg",
//       },
//       {
//         name: "Chocolate Chip Cheese Cake",
//         description:
//           "Prepare the base: 1. In a mixie/blender add the broken pieces of butter biscuits. Give it a whiz. The texture should be grainy. 2. Add softened butter to it and give it another whiz. Bring the whole mixture together with the help of a flat spoon or spatula. 3. In a baking dish, evenly spread this mixture. Pat it down with the spatula/ flat spoon. Refrigerate for 5-7 minutes.Prepare the cheesecake: 1. Pre-heat the oven at 200 degrees C. 2. In a bowl whisk the softened cream cheese. Whisk till it's smooth and no lumps are left. 3. Add the rose or vanilla essence and powdered sugar. Mix it well. 4. Now add the egg. Fold it in the cream cheese till well amalgamated. 5. Throw in 4 Tbsp chocolate chips. Give it a mix. 6. Now pour this mixture over the refrigerated base. 7 .Sprinkle the rest of the chocolate chips over this. 8. Bake at 150 degrees for 25 minutes. 9. Take it out of the oven and let it cool for 10 minutes. 10. Cover it with some cling/aluminum foil and refrigerate for 2-3 hours. 11. Cut it into bars, squares or wedges. Serve.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "For the base:",
//           "18 Butter biscuits (broken into pieces)",
//           "75 gram Butter (softened)",
//           "For the cheesecake:",
//           "226 gram Cream cheese (softened)",
//           "5 tbsp Sugar,powdered",
//           "1 Egg",
//           "2 drops Rose essence or Vanilla essence",
//           "5 tbsp Chocolate chips",
//         ],
//         category: "American",
//         image: "chocolate-cake.jpg",
//       },
//       {
//         name: "Strawberry Milkshake",
//         description:
//           "1. Put the strawberries and sugar in a mixie, add a bit of milk and roughly puree it for just a few seconds. 2. Now add the rest of the milk and start the mixing again for 15-20 seconds. 3. Add the ice-cream and blend it all together into a thick shake. Serve chilled.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "200 Gram Strawberries",
//           "2 tbsp Sugar",
//           "400 ml Milk",
//           "5-6 tbsp Strawberry Ice-Cream",
//         ],
//         category: "American",
//         image: "strawberry-milkshake.jpg",
//       },
//       {
//         name: "Masala Dosa",
//         description:
//           "1.Wash and soak the rice in one container and the dal and fenugreek seeds together in another container for 5-6 hours or over night, depending on the weather.2.Grind dal mixture together to a very smooth consistency. Next grind the rice smooth too and mix the two batters.3.Add salt and enough water to make into a dropping consistency. Leave to ferment over-night or more depending on the weather, till a little spongy.4.If thickened too much, add a little water to thin a bit. Heat tawa, and brush oil over it. When really hot, splash a little water over it, and immediately pour batter onto it, spreading it thin, with a circular motion.5.This will have to be very swift and will need a bit of practice.6.After spreading the batter, lower the heat and dribble a little oil around the edges so that it seeps under the dosa.7.When edges start browning a bit, pass a flat spoon under it to ease the dosa off the pan. Put desired filling in the center, and fold the two edges over.8.Serve accompanied with sambhar and chutney.Prepare the masala filling:1.Heat the oil in a heavy based pan and add the mustard seeds, then onions, curry leaves and green chillies, and saute over high heat till the onions are a little transparent.2.Add the salt and the turmeric and mix well, before adding the potatoes.3.Turn the potatoes around till well mixed, and add the water, and let it simmer, for 2-3 minutes.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "2 Cups rice (preferably parboiled)",
//           "1/2 cup black Gram (Dhuli Urad)(split and husked)",
//           "1/2 tsp fenugreek seeds",
//           "2 tsp salt",
//           "Oil (for cooking dosas)",
//           "For the Masala for Dosas:",
//           "500 gms potatoes (peeled and cubed) boiled",
//           "1 and 1/2 cups onions sliced",
//           "2 green chillies (optional) finely chopped",
//           "2 tbsp oil",
//           "1 tsp mustard seeds",
//           "6-7 Curry leaves",
//           "2 tsp salt",
//           "1/4 tsp turmeric powdered",
//           "1/2 cup water",
//         ],
//         category: "South Indian",
//         image: "dosa.jpg",
//       },
//       {
//         name: "Mexican Salad",
//         description:
//           "To Make The Dressing: Whisk all ingredients together in a bowl (or shake together in a mason jar) until combined.  Use immediately or refrigerate in a sealed container for up to 3 days. To Make The Salad: Combine all ingredients in a large salad bowl, drizzle evenly with the salad dressing, and toss until evenly combined.  Serve immediately and enjoy!",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "MEXICAN SALAD INGREDIENTS:",
//           "5 ounces mixed spring greens  (or whatever greens you prefer)",
//           "1 ripe avocado (peeled pitted and sliced)",
//           "half a small red onion (peeled and thinly sliced)",
//           "1 cup halved cherry tomatoes",
//           "2/3 cup roughly-chopped fresh cilantro",
//           "1/3 cup pepitas",
//           "optional: 1/2 cup crumbled queso fresco or cotija cheese",
//           "CUMIN-LIME DRESSING INGREDIENTS:",
//           "3 tablespoons avocado oil or olive oil",
//           "1 tablespoon fresh lime juice",
//           "1/2 teaspoon fine sea salt",
//           "1/2 teaspoon  ground cumin",
//           "1/4 teaspoon freshly-cracked black pepper",
//           "1 small clove garlic (pressed or minced (or 1/2 teaspoon garlic powder))",
//         ],
//         category: "Mexican",
//         image: "mexican-salad.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

//insertRecipeData();
