require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
// GET Homepage
exports.homepage = async (req, res) => {
  try {
    limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const indian = await Recipe.find({'category':'Indian'}).limit(limitNumber);
    const american = await Recipe.find({'category':'American'}).limit(limitNumber);
    const italian = await Recipe.find({'category':'Italian'}).limit(limitNumber);
    const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);
    const mexican = await Recipe.find({'category':'Mexican'}).limit(limitNumber);
    const food = {latest, indian, american, italian, chinese,mexican};
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
exports.exploreRecipe = async(req,res)=>{
    try{
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render("recipe",{title:'Cooking Blog- Recipe',recipe});
    }catch(error){
        res.status(500).send({message: error.message || "Error Occured"})
    }
}

//GET /categories by Id
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    limitNumber = 20;
    const categoryById = await Recipe.find({'category': categoryId}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

//POST /search
exports.searchRecipe = async(req,res)=>{
  try{
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({$text: {$search: searchTerm, $diacriticSensitive: true}});
    //res.json(recipe);
    res.render('search',{title: 'Cooking Blog - Search',recipe});
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured"});
  }
}

//GET /explore-latest
exports.exploreLatest = async(req,res)=>{
  try{
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      res.render("explore-latest",{title:'Cooking Blog- Explore Latest',recipe});
  }catch(error){
      res.status(500).send({message: error.message || "Error Occured"});
  }
}

//GET /random-recipe
exports.showRecipe = async(req,res)=>{
  try{
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random()*count);
    let recipe = await Recipe.findOne().skip(random).exec();
    //res.json(recipe);
    res.render('random-recipe',{title: 'Cooking Blog - Random Recipe', recipe});
  }catch(error){
    res.status(500).send({message: error.message || "Error Occured"});
  }
}


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
//         name: "Gulab Jamun",
//         description:
//           "HOW TO PREPARE SAFFRON FLAVOURED SUGAR SYRUP? 1.Take 1½ cups sugar, 3-4 green cardamoms (or 1/4 teaspoon cardamom powder) and 8-10 saffron strands in a deep pan. 2.Add 2½ cups water and bring mixture to boil over high flame. When it comes to rolling boil, reduce flame to medium and cook until sugar syrup is little sticky, it will take around 10-12 minutes. Stir occasionally in between. Turn off the flame. Sugar syrup is ready. After deep frying jamuns in later step, heat the sugar syrup for 4-5 minutes. HOW TO PREPARE GULAB JAMUNS? step-3 Prepare 1 cup mawa by following the recipe given above or use readymade mawa. Crumble it using hand or grate it using a grater. Add 1/8 teaspoon baking soda and 1/2 cup sifted maida. step-4 Mix them gently using a spoon. step-5 As you can see, the flour is easily mixed with mawa because of moisture step-6 Knead all of them together until smooth dough is prepared. If required add a few teaspoons of milk to knead a smooth and soft dough (add one teaspoon milk at a time until smooth consistency of dough is achieved, do not add large amount in single g step-7 Divide dough into 16-18 equal parts, grease hands with ghee and make smooth surfaced balls from it. Make sure that there is no crack on the surface of balls because it will make jamuns to crack open while deep frying. If you are not able to form crack-less balls, then you need to make dough bit softer. To do this, add milk in dough, knead it again and roll the balls again. Do not make very large balls because they will increase in size after deep frying and soaking in syr step-8 Heat ghee or oil (or 1/2 ghee and 1/2 oil) in a pan over medium flame. When ghee is medium hot, add a pinch of dough in hot ghee and if it comes upward immediately without changing it’s color, ghee is ready. If it turns brown immediately, ghee is too hot. If it doesn’t come upward, ghee is cold. Add prepared dough balls (4-6 at a time or depending on the size of a pan) and deep-fry them over low to medium flame. As you can see they will turn light golden and increase in size after a minute. If the jamuns turn dark brown immediately then the temperature of ghee is too hot, pour some cold ghee in to ghee to reduce the temperatu step-9 After 3-4 minutes, they will turn light golden bro step-10 Deep fry them until they turn golden brown, it will take around 6-7 minutes. Cooking them evenly is the key to soft and textured gulab jamuns, increase or decrease flame intensity to keep the temperature of ghee even while frying th step-11 Drain and transfer them over kitchen napkin and let them cool for 5-minutes. As you can see, the balls are increased in size after deep frying. Do not add them directly into warm sugar syrup. step-12 Add fried balls into warm sugar syrup (not hot syrup). If you add them into hot syrup, they will shrink in size. step-13 Soak them for at least 1-2 hours before serving. As you can see in the picture, the jammuns are increased to almost double in size. Gulab jamuns are ready for serving. Serve them warm or chilled.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "1/2 cup Maida (All Purpose Flour)",
//           "1 cup grated Mawa (Khoya)(approx. 200-225 gms)",
//           "1/8 teaspoon Baking Soda",
//           "Ghee (or oil), for deep frying",
//           "3-4 Green Cardamoms or 1/4 teaspoon Cardamom Powder (Elaichi Powder)",
//           "8-10 Saffron Strands (kesar)",
//           "1½ cups Sugar",
//           "2½ cups Water",
//         ],
//         category: "Indian",
//         image: "gulab-jamun.jpg",
//       },
//       {
//         name: "Khaman Dhokla",
//         description:
//           "1. Take gram flour in a bowl. Add yogurt and approximately one cup of warm water and mix. Avoid lumps. Add salt and mix again. 2.Leave it aside to ferment for three to four hours. When gram flour mixture has fermented, add turmeric powder and green chilli-ginger paste. Mix. Heat the steamer. Grease a thali. 3.In a small bowl take lemon juice, soda bicarbonate, one teaspoon of oil and mix. Add it to the batter and whisk briskly. Pour batter into the greased thali and place it in the steamer. 4.Cover with the lid and steam for ten minutes. When a little cool, cut into squares and keep in a serving bowl/plate. 5.Heat remaining oil in a small pan. Add mustard seeds. When the seeds begin to crackle, remove and pour over the dhoklas. 6.Serve, garnished with chopped coriander leaves and scraped coconut.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "Gram flour (besan) sieved 2 cups",
//           "Yogurt beaten 1 cup",
//           "Salt to taste",
//           "Turmeric powder 1/2 teaspoon",
//           "Green chilli-ginger paste 1 teaspoon",
//           "Oil 2 tablespoons",
//           "Lemon juice 1 tablespoon",
//           "Soda bicarbonate 1 teaspoon",
//           "Mustard seeds 1 teaspoon",
//           "Fresh coriander leaves chopped 2 tablespoons",
//           "Coconut scraped 1/2 cup",
//         ],
//         category: "Indian",
//         image: "khaman.jpg",
//       },
//       {
//         name: "Red Sauce Pasta",
//         description:
//           "BOILING PASTA: 1.firstly, in a large kadai boil 6 cup water and 1 tsp salt. 2. once the water comes to a boil, add 2 cup pasta. i have used elicoidali pasta, you can alternatively use penne pasta. 3. boil for 7 minutes, or until the pasta is cooked al dente. 4. drain off the pasta and keep aside.PASTA SAUCE PREPARATION: 1. firstly, in a large vessel with hot boiling water, drop 5 tomato marked x. 2. also, add 2 dried red chilli and boil for 5 minutes. 3. drain off and peel the skin of tomatoes. 4. blend to smooth paste, keep aside. 5. in a large wok, take 2 tbsp olive oil and saute 2 clove garlic. 6. add 1 onion and saute well. 7. further add 1 tsp chilli flakes, 1 tsp mixed herbs, ¼ tsp pepper powder and ½ tsp salt. saute well. 8. now add prepared tomato puree, 2 tbsp tomato sauce and mix well. 9. cook for 2 minutes or until tomato puree is cooked completely. 10. now add in boiled pasta and mix well. 11. finally, grate some cheese and enjoy red sauce pasta.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "5 cup water",
//           "1 tablespoon salt",
//           "2 cup pasta",
//           "5 tomato",
//           "2 dried red chilli (optional)",
//           "2 tablespoon oil",
//           "2 clove garlic (finely chopped)",
//           "1 onion (finely chopped)",
//           "1 tablespoon chilli flakes",
//           "1 tablespoon mixed herbs",
//           "1/4 tablespoon pepper powder",
//           "2 tablespoon tomato sauce",
//         ],
//         category: "Italian",
//         image: "red-sauce-pasta.jpg",
//       },
//       {
//         name: "Burger",
//         description:
//           "To make the burger patty, pressure cook the carrot, peas and sweet corn for 1 whistle or until soft. Add the cooked vegetables, chopped onions, red chilli powder, lemon juice, garam masala powder, salt and ginger-garlic paste to a large bowl. Add lemon juice and mashed potatoes in the bowl, mix well until evenly combined. Shape the mixture into small/medium patties.Now heat oil in a pan over medium flame. Roll the prepared patties in the breadcrumbs and shallow fry until golden brown on both sides. Remove and keep aside. Take one half of the burger bun. Spread some butter and place the lettuce on top. Place the prepared vegetable patty on top. Top up with slices of onion, tomato, cucumber and cheese. If you want to make it even more delicious and healthy replace cheese with eggless mayonnaise. Cover it with the other half of the burger bun. If desired, add some ketchup on top. Secure it with a toothpick if desired. Serve at once with french fries. Make sure you like this recipe, rate it and let us know in the comments how it turned out to be.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "1 sliced onion",
//           "4 slices cheese slices",
//           "1 teaspoon powdered garam masala powder",
//           "2 teaspoon refined oil",
//           "1/2 gm ginger paste",
//           "4 halved burger buns",
//           "2 tablespoon tomato ketchup",
//           "1/2 teaspoon garlic paste",
//           "1 sliced tomato",
//           "2 teaspoon powdered red chilli",
//           "2 pinch powdered salt",
//           "3 tablespoon breadcrumbs",
//           "1 teaspoon lemon juice",
//           "3 tablespoon butter",
//           "1 handful chopped coriander leaves",
//           "4 leaves lettuce loose-leaf",
//           "1/2 peeled,sliced cucumber",
//           "2 chopped onion",
//           "1/2 cup shelled peas",
//           "2 mashed,boiled,peeled potato",
//           "2 chopped carrot",
//           "1/2 cup corn",
//         ],
//         category: "American",
//         image: "burger.jpg",
//       },
//       {
//         name: "Momos",
//         description: "step-1 Finely cut all vegetables as mentioned in the ingredients section.  step-2 Add 3/4 cup maida (all purpose flour), 1 teaspoon oil and salt in a large bowl.  step-3 Mix all ingredients well and prepare a soft pliable dough (like paratha dough) by adding water as needed. Cover the dough and keep it aside for 20-25 minutes.  step-4 Heat 1 tablespoon oil in a pan over medium flame. Add finely chopped ginger and garlic and sauté for 30 seconds. Add green onion and sauté for a minute. step-5 Add all chopped veggies (carrot, cabbage, capsicum and green beans) and salt.  step-6 Mix well and sauté them for 4-5 minutes. Add 1 teaspoon chilli sauce.  step-7 Add 1/2 -1 teaspoon soy sauce.  step-8 Add 1/2 teaspoon black pepper powder.  step-9 Mix well and sauté for a minute. Turn off the flame. Stuffing for Veg Momos is ready. step-10 Knead the dough again for a minute and divide it into 2-equal portions. Give each portion a round cylindrical shape like cucumber. Cut each one into 6-7 equal portions with a knife as shown in the photo. step-11 Give each small portion a round shape like ball and flatten it a little into pattie by pressing it in between your palms. Cover them with a wet cloth or a plate to prevent them from drying. step-12 Place one dough pattie on a rolling board and roll it out into a thin disc (approx. 4-5 inch diameter). Roll it from sides and keep the center portion little thick compared to sides. If required, sprinkle some dry flour while rolling. step-13 Place approx. 1 tablespoon filling in the center. Don’t over-stuff it, otherwise it will be difficult to get a proper “potli” shape. step-14 Lift the edge from one side and start pleating (fold the edge a little inside and then little outside alternatively). Join them in the center to seal it. step-15 Prepare momos from remaining dough patties in a similar way. step-16 Grease a steamer plate or any other plate (it should easily fit into the steamer or a deep vessel) with oil to prevent them sticking. You can also line a plate with cabbage leaf instead of greasing the surface with oil. Arrange Veg Momos on a plate in a way that there is some space around them to expand. step-17 Heat 1-2 glass of water in a steamer or a deep vessel over medium flame. step-18 Place stand in the steamer and place momos plate over it. Momos should not touch the water. Cover the steamer/vessel with a lid and steam them for 6-7 minutes over medium flame or until they look little translucent and shiny. Remove the lid and check them by touching it. If they don’t feel sticky then it means they are cooked. step-19 Transfer them to a serving plate. Serve hot Veg Momos with Momos Chutney or Schezwan Sauce.",
//         email: "farhat@gmail.com",
//         ingredients: [
//           "1+ 1/2 cup all purpose flour",
//           "1/4 tsp salt ",
//           "1/2 cup Water ",
//           "1 cup chicken, minced",
//           "1/4 tsp salt",
//           "1 tbsp soy sauce ",
//           "1/2 tsp green pepper, chopped",
//           "1/2 tsp ginger garlic paste ",
//           "1/4 cup spring onion, chopped",
//           "1+1/2 tbsp hot cooking oil",
//         ],
//         category: "Chinese",
//         image: "momos-chinese.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

// insertRecipeData();
