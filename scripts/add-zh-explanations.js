#!/usr/bin/env node
/**
 * Generate Chinese explanation_zh for all ingredients in ingredients.json
 * Uses pattern matching on English explanations + category-based templates
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'ingredients.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Direct name-to-Chinese-explanation map for important/tricky items
const DIRECT_MAP = {
  // === Protein - Poultry ===
  'Chicken': '优质完整蛋白质来源，氨基酸谱优秀，适合猫犬。',
  'Chicken Meal': '脱水浓缩鸡肉蛋白，按重量计蛋白质含量高于新鲜鸡肉。',
  'Chicken By-Product Meal': '由鸡脖、鸡爪、内脏等部位制成。品质低于明确命名的肉类，但仍能提供蛋白质。',
  'Chicken Fat': 'omega-6脂肪酸和亚油酸的天然来源。保存良好的鸡脂肪是优质成分。',
  'Chicken Liver': '营养丰富的内脏肉，富含铁、维生素A和B族维生素。极佳的适口性增强剂。',
  'Chicken Heart': '优质内脏肉，牛磺酸含量高，对猫必需，对犬有益。',
  'Turkey': '瘦肉型优质蛋白质来源。适合对鸡肉敏感的宠物。',
  'Turkey Meal': '浓缩火鸡蛋白，优质氨基酸来源。',
  'Turkey Liver': '优质内脏肉，富含必需维生素和矿物质。',
  'Turkey Heart': '富含牛磺酸的内脏肉，对猫必需。',
  'Duck': '新型蛋白质来源，适合常见蛋白质过敏的宠物。富含铁质。',
  'Duck Meal': '浓缩鸭肉蛋白来源，生物价值高。',
  'Duck Liver': '营养丰富的内脏肉，适口性极佳。',

  // === Protein - Fish ===
  'Salmon': 'omega-3脂肪酸（EPA/DHA）的优质来源，支持皮肤、毛发和关节健康。',
  'Salmon Meal': '浓缩三文鱼蛋白，omega-3含量高。优质蛋白质来源。',
  'Salmon Oil': 'EPA和DHA omega-3脂肪酸的丰富来源。支持大脑、皮肤、毛发和关节健康。',
  'Whitefish': '低脂蛋白质来源，富含omega-3。对食物敏感的宠物通常耐受良好。',
  'Whitefish Meal': '浓缩鱼类蛋白质来源，氨基酸谱良好。',
  'Herring': '小型多脂鱼类，富含omega-3脂肪酸。处于食物链底端，污染物较少。',
  'Herring Meal': '浓缩鲱鱼蛋白，omega-3含量优秀。',
  'Herring Oil': 'omega-3脂肪酸的优质来源，有益于皮肤、毛发和认知健康。',
  'Mackerel': '多脂鱼类，富含omega-3脂肪酸，优质蛋白质来源。',
  'Sardine': '小型鱼类，富含omega-3和钙质。汞含量风险低。',
  'Trout': '优质淡水鱼蛋白质，富含omega-3脂肪酸。',
  'Cod': '低脂白色鱼肉蛋白，高消化率，脂肪含量低。',
  'Tuna': '良好的蛋白质来源，但汞含量可能较高。建议适量食用，尤其是猫。',
  'Menhaden Fish Meal': '优质鱼粉，富含omega-3，蛋白质消化率高。',

  // === Protein - Red Meat ===
  'Beef': '优质红肉蛋白质，富含铁、锌和B族维生素。',
  'Beef Meal': '浓缩牛肉蛋白来源，氨基酸谱良好。',
  'Beef Liver': '高营养内脏肉，富含维生素A、铁和B12。',
  'Beef Heart': '牛磺酸和辅酶Q10的优质来源。优质内脏肉。',
  'Lamb': '优质蛋白质来源，适合对鸡肉或牛肉过敏的宠物。',
  'Lamb Meal': '浓缩羊肉蛋白来源，消化率良好。',
  'Lamb Liver': '营养丰富的内脏肉，天然维生素和矿物质来源。',
  'Venison': '瘦肉型新型蛋白质，适合过敏体质宠物的排除饮食。',
  'Venison Meal': '浓缩鹿肉蛋白来源，低过敏性蛋白质。',
  'Bison': '瘦肉型新型蛋白质来源，铁含量高。适合对常见蛋白质过敏的宠物。',
  'Bison Meal': '浓缩野牛蛋白，低脂高蛋白。',
  'Pork': '优质蛋白质来源，富含硫胺素。过敏性低于鸡肉或牛肉。',
  'Pork Meal': '浓缩猪肉蛋白来源，氨基酸含量良好。',
  'Pork Liver': '营养密集的内脏肉，富含铁和B族维生素。',
  'Rabbit': '瘦肉型新型蛋白质，非常适合有食物敏感性的宠物。',
  'Rabbit Meal': '浓缩兔肉蛋白，低过敏性和高消化率。',

  // === Protein - Other ===
  'Egg': '完整蛋白质来源，含所有必需氨基酸。高消化率。',
  'Whole Egg': '完整蛋白质来源，含所有必需氨基酸。高消化率。',
  'Dried Egg Product': '脱水全蛋，保留蛋白质含量。浓缩蛋白来源。',
  'Egg White': '纯蛋白质来源，脂肪含量极低。高生物价值。',

  // === Grains ===
  'Brown Rice': '全谷物，提供复合碳水化合物、纤维和B族维生素。易于消化。',
  'White Rice': '精制谷物，消化率高但营养价值低于糙米。适合敏感肠胃。',
  'Oatmeal': '全谷物碳水化合物来源，富含可溶性纤维。适合多数宠物。',
  'Barley': '全谷物，富含纤维和B族维生素。良好的碳水化合物来源。',
  'Corn': '廉价填充成分。虽提供一定能量，但不是宠物食品的理想碳水来源。',
  'Wheat': '常见过敏原。提供碳水化合物但也是许多宠物的过敏源。',
  'Wheat Flour': '精制小麦，营养价值低。常用于低质宠物食品中充当粘合剂。',
  'Sorghum': '无麸质古老谷物，富含抗氧化剂。良好的碳水化合物替代品。',
  'Millet': '小型无麸质谷物，消化率良好。提供B族维生素和矿物质。',
  'Quinoa': '完整蛋白质谷物，含所有必需氨基酸。高营养密度。',
  'Rice': '消化率高的碳水化合物来源。适合肠胃敏感的宠物。',
  'Brewers Rice': '碎米粒，碾米的副产品。营养价值低于全粒米。',
  'Ground Rice': '研磨米粒，包括碎米。中等品质的碳水化合物来源。',
  'Rice Flour': '精制米粉，容易消化但纤维含量低。',
  'Oat Flour': '全谷物燕麦粉，温和且易消化。',
  'Whole Wheat': '全麦提供纤维和营养，但小麦是常见过敏原。',

  // === Fillers ===
  'Corn Gluten Meal': '玉米加工的蛋白质提取物。用作廉价蛋白质填充剂，非高品质蛋白来源。',
  'Wheat Gluten': '小麦蛋白提取物。植物蛋白，常用于低质宠物食品增加蛋白质含量。',
  'Soy Flour': '大豆粉，用于增加蛋白质含量。非高品质蛋白来源，可能导致胀气。',
  'Soybean Meal': '大豆加工后的副产品。廉价蛋白来源，但消化率低于动物蛋白。',
  'Cellulose': '木质纤维或植物纤维。仅做填充用途，无营养价值。',
  'Powdered Cellulose': '木浆粉。无营养价值的填充剂，仅提供纤维体积。',
  'Peanut Hulls': '花生壳磨粉。无营养价值的廉价纤维填充剂。',
  'Soybean Hulls': '大豆壳。低成本纤维来源，营养价值有限。',

  // === Vegetables ===
  'Sweet Potato': '优质无谷碳水化合物来源，富含β-胡萝卜素、纤维和维生素。',
  'Peas': '良好的植物蛋白和纤维来源。无谷配方中常见的碳水化合物。',
  'Chickpeas': '良好的植物蛋白和纤维来源。无谷配方中常用。',
  'Lentils': '营养丰富的豆类，提供蛋白质、纤维和必需矿物质。',
  'Pumpkin': '优质纤维和β-胡萝卜素来源。有助于消化健康。',
  'Carrots': 'β-胡萝卜素和纤维的天然来源。作为健康补充成分。',
  'Spinach': '富含铁、维生素和抗氧化剂的绿叶蔬菜。少量使用有益。',
  'Broccoli': '富含维生素C、K和纤维的十字花科蔬菜。适量有益。',
  'Kale': '营养密度极高的绿叶蔬菜，富含维生素A、C、K和抗氧化剂。',
  'Potato': '碳水化合物来源，无谷配方中常用。血糖指数较高。',
  'Potato Starch': '淀粉粘合剂和增稠剂。提供碳水化合物但营养价值有限。',

  // === Fruits ===
  'Apple': '提供纤维、维生素C和抗氧化剂。加工时去籽安全。',
  'Blueberry': '强效抗氧化剂来源，支持认知和免疫健康。优质功能性成分。',
  'Cranberry': '抗氧化成分，支持泌尿道健康。宠物食品中的有益添加。',
  'Banana': '天然钾和纤维来源。适量有益，但糖分含量高。',
  'Coconut': '含中链脂肪酸，支持皮肤和毛发健康。',

  // === Preservatives ===
  'Rosemary Extract': '具有抗氧化功能的天然防腐剂。安全的化学防腐剂替代品。',
  'Mixed Tocopherols': '天然维生素E混合物，用作防腐剂。安全有效的抗氧化保鲜剂。',
  'BHA': '人工合成抗氧化剂（丁基羟基茴香醚）。研究表明可能具有致癌性。',
  'BHT': '人工合成防腐剂（二丁基羟基甲苯）。安全性受到质疑。',
  'Ethoxyquin': '合成防腐剂，最初用作农药。与肝脏和肾脏问题有关，许多国家已限制使用。',
  'Sodium Bisulfite': '化学防腐剂，可能导致过敏反应。大量食用可能有害。',
  'Potassium Sorbate': '常用食品防腐剂，一般认为安全。低浓度下风险较低。',
  'Citric Acid': '天然酸味剂和防腐剂。一般公认安全，但过量可能刺激肠胃。',

  // === Colorings (ALL harmful) ===
  'Red 40': '人工色素，与多动症和行为问题有关。宠物食品中无必要添加。',
  'Yellow 5': '人工色素（柠檬黄），可能引发过敏反应。纯粹为视觉效果添加。',
  'Yellow 6': '人工色素（日落黄），与过敏和行为问题有关。不必要的添加。',
  'Blue 2': '人工色素（靛蓝），对宠物无益。与脑肿瘤有潜在关联。',
  'Titanium Dioxide': '白色着色剂。纯为外观添加，对宠物营养无益。安全性存疑。',
  'Caramel Color': '加工着色剂。某些类型含有4-甲基咪唑，可能致癌。',
  'Iron Oxide': '矿物着色剂。虽然毒性低，但在宠物食品中不必要。',

  // === Sweeteners (ALL harmful) ===
  'Sugar': '添加糖在宠物食品中毫无必要。导致肥胖、糖尿病和牙齿问题。',
  'Corn Syrup': '高度加工的甜味剂。导致肥胖和糖尿病。宠物食品中不应出现。',
  'Molasses': '含糖量高的甜味剂。少量可接受但非必需成分。',
  'Sorbitol': '糖醇类甜味剂。过量食用可导致胃肠不适和腹泻。',
  'Propylene Glycol': '合成甜味剂和保湿剂。对猫有毒，已被禁止用于猫粮。对犬也存在争议。',
  'Xylitol': '对犬极度危险的糖醇。即使微量也可导致低血糖、肝衰竭甚至死亡。',
  'Dextrose': '葡萄糖形式的糖。用于提升适口性但增加不必要的糖分摄入。',

  // === Key Additives ===
  'Glycerin': '保湿剂，使半湿粮保持柔软。植物甘油一般安全。',
  'Carrageenan': '海藻提取增稠剂。研究与肠道炎症有关联，存在争议。',
  'Menadione': '合成维生素K补充剂。存在毒性争议，许多优质品牌已停止使用。',
  'Sodium Nitrite': '防腐剂和发色剂。高浓度可能有毒，已知致癌物。',
  'Sodium Tripolyphosphate': '用于控制牙结石的磷酸盐。大量食用可能引起消化问题。',

  // === Thickeners ===
  'Guar Gum': '瓜尔豆天然增稠剂。一般安全，提供一定可溶性纤维。',
  'Xanthan Gum': '发酵产生的增稠剂。少量使用一般安全。',
  'Carrageenan (thickener)': '海藻提取增稠剂。研究与肠道炎症有关联。',
  'Agar-Agar': '海藻提取的天然凝胶剂。安全的增稠剂替代品。',
  'Locust Bean Gum': '角豆树天然增稠剂。安全且耐受性良好。',
  'Cassia Gum': '决明子天然增稠剂。一般安全，用于湿粮质地调节。',

  // === Common supplements ===
  'Chia Seed': '富含omega-3脂肪酸、纤维和抗氧化剂。',
  'Flaxseed': 'omega-3脂肪酸（ALA）的植物来源。支持皮肤和毛发健康。',
  'Kelp': '碘和微量矿物质的天然来源。支持甲状腺功能。',
  'Turmeric': '含姜黄素的天然抗炎成分。支持关节和消化健康。',
  'Glucosamine': '天然关节保健补充剂。支持软骨修复，有益关节健康。',
  'Chondroitin Sulfate': '常与氨基葡萄糖搭配使用的关节保健成分。',
  'L-Carnitine': '支持脂肪代谢和能量产生的氨基酸。有助于体重管理。',
  'Taurine': '对猫必需的氨基酸，支持心脏和眼睛健康。对犬也有益。',
  'Probiotics': '有益肠道菌群，支持消化健康和免疫功能。',
  'Yucca Schidigera Extract': '天然植物提取物，可减轻粪便异味。',
  'Green Tea Extract': '富含抗氧化剂的天然提取物。支持细胞健康。',
  'Dried Chicory Root': '天然菊粉来源（益生元）。促进有益肠道菌群生长。',

  // === Fiber ===
  'Rice Bran': '米糠外层，良好的纤维、健康脂肪和B族维生素来源。',
  'Beet Pulp': '甜菜加工后的纤维。温和的可溶性纤维来源，支持消化健康。',
  'Tomato Pomace': '番茄加工副产品，含纤维和番茄红素。并非劣质填充剂。',
  'Psyllium Husk': '优质可溶性纤维来源。有助于消化调节。',
  'Oat Fiber': '温和的纤维来源，支持消化健康。',

  // === Fat/Oil ===
  'Fish Oil': 'EPA和DHA omega-3脂肪酸来源。支持皮肤、毛发、关节和大脑健康。',
  'Coconut Oil': '含中链脂肪酸（MCT），支持皮肤和毛发健康。可能有助于认知功能。',
  'Flaxseed Oil': '植物性omega-3来源。支持皮肤和毛发健康。',
  'Sunflower Oil': 'omega-6脂肪酸的来源。支持皮肤和毛发健康。',
  'Canola Oil': '均衡的omega-3和omega-6脂肪酸来源。品质因来源而异。',
  'Animal Fat': '未指明来源的动物脂肪。来源不明确是品质隐忧。',
  'Poultry Fat': '家禽脂肪，omega-6脂肪酸来源。来源未明确指定。',
  'Lard': '猪油，传统脂肪来源。适量安全但非理想脂肪来源。',
};

// Pattern-based translation functions by category
function translateByPattern(ingredient) {
  const { name, explanation, category, safety_rating } = ingredient;
  const exp = explanation.toLowerCase();

  // Check direct map first
  if (DIRECT_MAP[name]) return DIRECT_MAP[name];

  // Category-based pattern matching
  switch (category) {
    case 'protein':
      return translateProtein(name, exp, safety_rating);
    case 'grain':
      return translateGrain(name, exp, safety_rating);
    case 'vegetable':
      return translateVegetable(name, exp, safety_rating);
    case 'fruit':
      return translateFruit(name, exp, safety_rating);
    case 'fat_oil':
      return translateFatOil(name, exp, safety_rating);
    case 'fiber':
      return translateFiber(name, exp, safety_rating);
    case 'vitamin':
      return translateVitamin(name, exp, safety_rating);
    case 'mineral':
      return translateMineral(name, exp, safety_rating);
    case 'supplement':
      return translateSupplement(name, exp, safety_rating);
    case 'preservative':
      return translatePreservative(name, exp, safety_rating);
    case 'additive':
      return translateAdditive(name, exp, safety_rating);
    case 'coloring':
      return translateColoring(name, exp, safety_rating);
    case 'sweetener':
      return translateSweetener(name, exp, safety_rating);
    case 'filler':
      return translateFiller(name, exp, safety_rating);
    case 'thickener':
      return translateThickener(name, exp, safety_rating);
    case 'byproduct':
      return translateByproduct(name, exp, safety_rating);
    case 'flavor':
      return translateFlavor(name, exp, safety_rating);
    default:
      return translateGeneric(name, exp, safety_rating);
  }
}

function translateProtein(name, exp, rating) {
  if (name.includes('Meal')) {
    if (rating === 'caution') return `浓缩蛋白来源。品质因原料来源不同而异，需关注具体成分标注。`;
    return `浓缩蛋白来源，按重量计蛋白质含量高。优质氨基酸来源。`;
  }
  if (name.includes('Liver')) return `营养丰富的内脏肉，富含维生素和矿物质。优质天然营养来源。`;
  if (name.includes('Heart')) return `优质内脏肉，牛磺酸含量高。对猫必需，对犬有益。`;
  if (name.includes('Hydrolyzed')) return `水解蛋白质，分子量小，适合过敏体质宠物。低过敏性蛋白来源。`;
  if (exp.includes('novel protein')) return `新型蛋白质来源，适合对常见蛋白质过敏的宠物。`;
  if (exp.includes('omega-3')) return `优质蛋白质来源，富含omega-3脂肪酸。支持皮肤和毛发健康。`;
  if (exp.includes('lean')) return `瘦肉型优质蛋白质来源。脂肪含量低，消化率高。`;
  if (exp.includes('organ meat')) return `优质内脏肉，天然维生素和矿物质的丰富来源。`;
  if (exp.includes('allergi') || exp.includes('sensitive')) return `适合食物敏感宠物的蛋白质来源。过敏风险相对较低。`;
  if (rating === 'caution') return `蛋白质来源，但需注意品质和来源。建议适量食用。`;
  if (rating === 'harmful') return `低品质蛋白来源，来源不明或品质存疑。不推荐。`;
  return `优质蛋白质来源，提供必需氨基酸。适合猫犬。`;
}

function translateGrain(name, exp, rating) {
  if (exp.includes('whole grain')) return `全谷物，提供复合碳水化合物、纤维和多种营养素。`;
  if (exp.includes('allergen') || exp.includes('allerg')) return `常见过敏原。可能导致部分宠物过敏反应。`;
  if (exp.includes('gluten-free') || exp.includes('gluten free')) return `无麸质谷物，适合麸质敏感的宠物。良好的碳水化合物来源。`;
  if (rating === 'caution') return `碳水化合物来源，但营养价值或适用性存在一定顾虑。`;
  if (rating === 'harmful') return `低品质谷物成分，常用作廉价填充剂。`;
  return `碳水化合物来源，提供能量和部分营养素。`;
}

function translateVegetable(name, exp, rating) {
  if (exp.includes('antioxidant')) return `富含抗氧化剂的蔬菜成分。提供维生素和纤维。`;
  if (exp.includes('fiber')) return `良好的纤维和营养素来源。支持消化健康。`;
  if (exp.includes('grain-free') || exp.includes('carbohydrate')) return `无谷碳水化合物来源。提供能量、纤维和营养素。`;
  if (exp.includes('protein')) return `植物蛋白和纤维来源。无谷配方中常用。`;
  return `蔬菜成分，提供纤维、维生素和矿物质。`;
}

function translateFruit(name, exp, rating) {
  if (exp.includes('antioxidant')) return `富含抗氧化剂的水果成分。支持免疫和细胞健康。`;
  if (exp.includes('vitamin c') || exp.includes('vitamin C')) return `天然维生素C来源。提供抗氧化剂和纤维。`;
  if (exp.includes('urinary')) return `支持泌尿道健康的水果成分。含有益抗氧化剂。`;
  return `天然水果成分，提供维生素、纤维和抗氧化剂。`;
}

function translateFatOil(name, exp, rating) {
  if (exp.includes('omega-3')) return `omega-3脂肪酸来源。支持皮肤、毛发和关节健康。`;
  if (exp.includes('omega-6')) return `omega-6脂肪酸来源。支持皮肤和毛发健康。`;
  if (exp.includes('mct') || exp.includes('medium-chain')) return `含中链脂肪酸。支持能量代谢和皮肤健康。`;
  if (rating === 'caution') return `脂肪来源，但来源或品质存在一定顾虑。`;
  if (rating === 'harmful') return `低品质脂肪来源，来源不明或可能含有有害物质。`;
  return `脂肪酸来源，提供必需脂肪酸和能量。`;
}

function translateFiber(name, exp, rating) {
  if (exp.includes('prebiotic') || exp.includes('beneficial bacteria')) return `益生元纤维来源。促进有益肠道菌群生长。`;
  if (exp.includes('soluble fiber')) return `可溶性纤维来源。支持消化健康和肠道功能。`;
  return `膳食纤维来源。支持消化健康。`;
}

function translateVitamin(name, exp, rating) {
  if (name.includes('Vitamin A') || exp.includes('vitamin a')) return `维生素A补充剂。支持视力、免疫和皮肤健康。`;
  if (name.includes('Vitamin C') || exp.includes('vitamin c')) return `维生素C（抗坏血酸）。抗氧化剂，支持免疫健康。`;
  if (name.includes('Vitamin D') || exp.includes('vitamin d')) return `维生素D补充剂。支持钙吸收和骨骼健康。`;
  if (name.includes('Vitamin E') || exp.includes('vitamin e')) return `维生素E补充剂。强效抗氧化剂，支持免疫和皮肤健康。`;
  if (name.includes('Vitamin K') || exp.includes('vitamin k')) return `维生素K补充剂。支持血液凝固和骨骼健康。`;
  if (exp.includes('b vitamin') || exp.includes('b-vitamin') || name.includes('B12') || name.includes('B6') || name.includes('B1') || name.includes('B2') || name.includes('B3') || name.includes('B5')) {
    return `B族维生素补充剂。支持能量代谢和神经功能。`;
  }
  if (exp.includes('antioxidant')) return `抗氧化维生素补充剂。支持免疫和细胞健康。`;
  return `维生素补充剂。满足宠物日常营养需求。`;
}

function translateMineral(name, exp, rating) {
  if (exp.includes('calcium') || name.includes('Calcium')) return `钙质补充剂。支持骨骼和牙齿健康。`;
  if (exp.includes('iron') || name.includes('Iron')) return `铁质补充剂。支持血红蛋白生成和氧气运输。`;
  if (exp.includes('zinc') || name.includes('Zinc')) return `锌补充剂。支持免疫功能、皮肤和毛发健康。`;
  if (exp.includes('copper') || name.includes('Copper')) return `铜补充剂。支持铁吸收和结缔组织形成。`;
  if (exp.includes('manganese') || name.includes('Manganese')) return `锰补充剂。支持骨骼发育和代谢功能。`;
  if (exp.includes('selenium') || name.includes('Selenium')) return `硒补充剂。抗氧化矿物质，支持免疫和甲状腺功能。`;
  if (exp.includes('iodine') || name.includes('Iodine') || name.includes('Iodate')) return `碘补充剂。支持甲状腺功能正常运作。`;
  if (exp.includes('potassium') || name.includes('Potassium')) return `钾补充剂。支持心脏功能和肌肉收缩。`;
  if (exp.includes('magnesium') || name.includes('Magnesium')) return `镁补充剂。支持肌肉和神经功能。`;
  if (exp.includes('phosphorus') || name.includes('Phosphorus') || name.includes('Phosphate')) return `磷补充剂。支持骨骼和牙齿健康。`;
  if (exp.includes('sodium') || name.includes('Sodium')) return `钠补充剂。维持电解质平衡。`;
  if (exp.includes('cobalt') || name.includes('Cobalt')) return `钴补充剂。维生素B12合成所需微量矿物质。`;
  return `矿物质补充剂。满足宠物必需矿物质需求。`;
}

function translateSupplement(name, exp, rating) {
  if (exp.includes('probiotic') || exp.includes('beneficial bacteria') || exp.includes('gut flora')) return `益生菌补充剂。支持消化健康和肠道菌群平衡。`;
  if (exp.includes('prebiotic')) return `益生元补充剂。促进有益肠道菌群生长。`;
  if (exp.includes('joint') || exp.includes('cartilage')) return `关节保健补充剂。支持关节灵活性和软骨健康。`;
  if (exp.includes('omega-3') || exp.includes('fatty acid')) return `必需脂肪酸补充剂。支持皮肤、毛发和整体健康。`;
  if (exp.includes('antioxidant')) return `天然抗氧化成分。支持免疫和细胞健康。`;
  if (exp.includes('digestive') || exp.includes('digestion')) return `消化健康补充剂。支持营养吸收和肠道功能。`;
  if (exp.includes('immune')) return `免疫支持补充剂。促进免疫系统正常功能。`;
  if (exp.includes('amino acid') || exp.includes('protein')) return `氨基酸补充剂。支持蛋白质合成和身体机能。`;
  if (exp.includes('anti-inflamm')) return `天然抗炎成分。支持关节和消化健康。`;
  if (exp.includes('skin') || exp.includes('coat')) return `支持皮肤和毛发健康的营养补充剂。`;
  if (exp.includes('fiber')) return `纤维补充剂。支持消化健康。`;
  if (exp.includes('enzyme')) return `消化酶补充剂。帮助营养物质分解和吸收。`;
  if (rating === 'caution') return `营养补充成分。效果或安全性存在一定争议。`;
  return `营养补充成分。支持宠物整体健康。`;
}

function translatePreservative(name, exp, rating) {
  if (exp.includes('natural')) return `天然防腐剂。安全的化学防腐剂替代品。`;
  if (rating === 'harmful') return `人工合成防腐剂。安全性存在严重顾虑，不推荐用于宠物食品。`;
  if (rating === 'caution') return `防腐剂。安全性存在一定争议，建议关注。`;
  return `防腐剂。用于延长食品保质期。`;
}

function translateAdditive(name, exp, rating) {
  if (exp.includes('humectant') || exp.includes('moisture')) return `保湿剂。保持食品水分和柔软质地。`;
  if (exp.includes('emulsif')) return `乳化剂。帮助油水混合，改善食品质地。`;
  if (exp.includes('ph') || exp.includes('acid')) return `酸度调节剂。用于调控食品pH值。`;
  if (rating === 'harmful') return `人工添加剂。安全性存在严重顾虑，不推荐。`;
  if (rating === 'caution') return `食品添加剂。安全性存在一定争议。`;
  return `食品添加剂。用于改善食品品质或加工性能。`;
}

function translateColoring(name, exp, rating) {
  if (exp.includes('artificial')) return `人工色素。对宠物无营养价值，纯为外观添加。不推荐。`;
  return `着色剂。对宠物无营养价值，不必要的添加。`;
}

function translateSweetener(name, exp, rating) {
  if (exp.includes('toxic') || exp.includes('dangerous')) return `甜味剂。对宠物有毒性风险，应严格避免。`;
  return `甜味剂。宠物食品中不必要的添加，可能导致健康问题。`;
}

function translateFiller(name, exp, rating) {
  if (exp.includes('protein')) return `蛋白质填充成分。非高品质蛋白来源，常用于降低成本。`;
  if (exp.includes('no nutritional')) return `填充剂。无营养价值，仅增加食品体积。`;
  return `填充成分。营养价值有限，主要用于降低成本或增加体积。`;
}

function translateThickener(name, exp, rating) {
  if (exp.includes('natural')) return `天然增稠剂。一般安全，用于改善食品质地。`;
  if (rating === 'caution') return `增稠剂。安全性存在一定争议。`;
  return `增稠剂。用于改善食品质地和口感。`;
}

function translateByproduct(name, exp, rating) {
  if (exp.includes('unspecified') || exp.includes('unnamed')) return `来源不明确的副产品。品质无法保证，不推荐。`;
  return `副产品成分。品质低于明确命名的原料，但仍含一定营养。`;
}

function translateFlavor(name, exp, rating) {
  if (exp.includes('natural')) return `天然调味剂。来源于天然原料，一般安全。`;
  if (exp.includes('artificial')) return `人工调味剂。非天然来源，安全性存在顾虑。`;
  if (rating === 'caution') return `调味成分。来源或品质存在一定顾虑。`;
  return `调味成分。用于提升食品适口性。`;
}

function translateGeneric(name, exp, rating) {
  if (rating === 'harmful') return `有害成分。不推荐在宠物食品中使用。`;
  if (rating === 'caution') return `需注意的成分。安全性或品质存在一定顾虑。`;
  return `宠物食品成分。一般安全。`;
}

// Process all ingredients
let translated = 0;
let directHit = 0;
let patternHit = 0;

for (const ingredient of data.ingredients) {
  const zhExp = DIRECT_MAP[ingredient.name];
  if (zhExp) {
    ingredient.explanation_zh = zhExp;
    directHit++;
  } else {
    ingredient.explanation_zh = translateByPattern(ingredient);
    patternHit++;
  }
  translated++;
}

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

console.log(`Done! Translated ${translated} ingredients:`);
console.log(`  Direct map: ${directHit}`);
console.log(`  Pattern-based: ${patternHit}`);
