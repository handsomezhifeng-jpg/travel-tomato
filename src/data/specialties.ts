// 城市特产数据
// key: "cityName|country" -> { name, nameZh, description, descriptionZh, icon }

export interface SpecialtyInfo {
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  icon: string  // emoji
}

const specialtyMap: Record<string, SpecialtyInfo> = {
  // ===== 中国城市 =====
  'Beijing|China': { name: 'Peking Duck', nameZh: '北京烤鸭', icon: '🦆', description: 'World-famous roasted duck with crispy skin, served with thin pancakes and scallions.', descriptionZh: '世界闻名的烤鸭，皮脆肉嫩，配以薄饼和葱丝食用，是北京最具代表性的美食。' },
  'Tianjin|China': { name: 'Goubuli Steamed Buns', nameZh: '狗不理包子', icon: '🥟', description: 'Famous steamed buns with over 160 years of history, known for thin skin and rich filling.', descriptionZh: '天津百年老字号，皮薄馅大，十八个褶花匀称，鲜香不腻。' },
  'Shijiazhuang|China': { name: 'Donkey Burgers', nameZh: '驴肉火烧', icon: '🫓', description: 'Traditional flatbread stuffed with tender braised donkey meat, a beloved Hebei snack.', descriptionZh: '河北传统名吃，外酥内软的火烧夹着卤制驴肉，民间有"天上龙肉，地上驴肉"之说。' },
  'Shanghai|China': { name: 'Xiaolongbao', nameZh: '小笼包', icon: '🥟', description: 'Delicate steamed soup dumplings with thin translucent skin and rich savory broth inside.', descriptionZh: '上海经典点心，皮薄如纸，汤汁鲜美，轻轻一咬满口留香。' },
  'Suzhou|China': { name: 'Biluochun Tea', nameZh: '碧螺春', icon: '🍵', description: 'Premium green tea from Dongting Mountain, with a delicate aroma and curled leaf shape.', descriptionZh: '中国十大名茶之一，产于太湖洞庭山，形似螺旋，清香袭人。' },
  'Wuxi|China': { name: 'Wuxi Spare Ribs', nameZh: '无锡排骨', icon: '🍖', description: 'Sweet and savory braised pork ribs, a signature Wuxi dish with over a century of history.', descriptionZh: '无锡三大特产之一，色泽酱红，酥香入味，甜咸适口。' },
  'Changzhou|China': { name: 'Comb', nameZh: '常州梳篦', icon: '💇', description: 'Traditional handmade combs and fine-toothed combs, a renowned Changzhou craft since ancient times.', descriptionZh: '常州非遗工艺品，选材考究，制作精细，有"宫梳名篦"之美誉。' },
  'Nanjing|China': { name: 'Salted Duck', nameZh: '南京盐水鸭', icon: '🦆', description: 'Lightly salted and boiled duck, tender and fragrant, a Nanjing culinary icon.', descriptionZh: '南京著名特产，皮白肉嫩，清淡鲜美，素有"金陵第一鸭"之称。' },
  'Hangzhou|China': { name: 'Longjing Tea', nameZh: '龙井茶', icon: '🍵', description: 'China\'s most prestigious green tea from West Lake, with flat leaves and chestnut aroma.', descriptionZh: '中国十大名茶之首，产于西湖龙井村，色翠香郁，味甘形美。' },
  'Ningbo|China': { name: 'Tangyuan', nameZh: '宁波汤圆', icon: '🍡', description: 'Glutinous rice balls with sweet sesame filling, a traditional Ningbo dessert.', descriptionZh: '宁波传统名点，糯米皮滑糯细腻，黑芝麻馅甜香流心。' },
  'Guangzhou|China': { name: 'Cantonese Dim Sum', nameZh: '广式点心', icon: '🥡', description: 'Exquisite variety of bite-sized dishes from shrimp dumplings to char siu bao.', descriptionZh: '广府饮食文化精粹，虾饺、叉烧包、烧麦、蛋挞等精致点心享誉世界。' },
  'Shenzhen|China': { name: 'Shahe Rice Noodles', nameZh: '沙河粉', icon: '🍜', description: 'Silky flat rice noodles, stir-fried or in soup, a Cantonese staple.', descriptionZh: '广东传统米粉，口感滑嫩，可炒可汤，是深圳人日常美食。' },
  'Dongguan|China': { name: 'Dongguan Rice Noodle Rolls', nameZh: '东莞肠粉', icon: '🥡', description: 'Steamed rice noodle rolls with various fillings, a classic Cantonese breakfast.', descriptionZh: '东莞特色早餐，米浆蒸成薄皮裹以虾仁或肉末，滑嫩鲜美。' },
  'Foshan|China': { name: 'Foshan Blind Kung Fu Cake', nameZh: '佛山盲公饼', icon: '🍪', description: 'Traditional pastry with a crispy texture and sesame-peanut flavor.', descriptionZh: '佛山百年老字号糕点，酥脆可口，花生芝麻香气浓郁。' },
  'Zhuhai|China': { name: 'Oyster', nameZh: '横琴蚝', icon: '🦪', description: 'Fresh oysters from Zhuhai\'s coastal waters, plump and briny.', descriptionZh: '珠海横琴特产生蚝，肥美鲜甜，是珠海最负盛名的海鲜。' },
  'Hong Kong|China': { name: 'Egg Waffle', nameZh: '鸡蛋仔', icon: '🧇', description: 'Iconic Hong Kong street snack, crispy egg-shaped waffles with a soft center.', descriptionZh: '香港经典街头小吃，外脆内软，蛋香浓郁，是港式怀旧味道的代表。' },
  'Macau|China': { name: 'Egg Tart', nameZh: '葡式蛋挞', icon: '🥧', description: 'Portuguese-style egg tart with caramelized custard top, a Macau signature.', descriptionZh: '澳门招牌甜品，酥皮层叠，焦糖蛋液香滑，中西合璧的经典美味。' },
  'Chengdu|China': { name: 'Sichuan Hotpot', nameZh: '四川火锅', icon: '🍲', description: 'Fiery hotpot with numbing Sichuan peppercorns and rich chili broth.', descriptionZh: '成都美食名片，麻辣鲜香的红油锅底，涮煮万物，令人欲罢不能。' },
  'Chongqing|China': { name: 'Chongqing Noodles', nameZh: '重庆小面', icon: '🍜', description: 'Spicy and numbing wheat noodles with chili oil and peanuts, a Chongqing staple.', descriptionZh: '重庆人的灵魂早餐，麻辣鲜香，一碗小面唤醒一座城。' },
  'Wuhan|China': { name: 'Hot Dry Noodles', nameZh: '热干面', icon: '🍝', description: 'Sesame paste noodles, a beloved breakfast staple of Wuhan locals.', descriptionZh: '武汉过早首选，碱面拌以芝麻酱，香浓可口，是武汉人的乡愁味道。' },
  "Xi'an|China": { name: 'Roujiamo', nameZh: '肉夹馍', icon: '🫓', description: 'Chinese hamburger with slow-braised meat in a crispy flatbread.', descriptionZh: '西安名吃，白吉馍夹腊汁肉，外酥里嫩，被誉为"中国汉堡"。' },
  'Harbin|China': { name: 'Harbin Red Sausage', nameZh: '哈尔滨红肠', icon: '🌭', description: 'Russian-influenced smoked sausage with a distinctive garlic flavor.', descriptionZh: '哈尔滨特产，源自俄式灌肠工艺，烟熏蒜香，是东北人的经典零食。' },
  'Dalian|China': { name: 'Sea Cucumber', nameZh: '大连海参', icon: '🌊', description: 'Premium sea cucumber from the Bohai Sea, prized for its nutritional value.', descriptionZh: '大连特产海参，产自渤海湾，肉质厚实，营养丰富，是滋补佳品。' },
  'Shenyang|China': { name: 'Laobian Dumplings', nameZh: '老边饺子', icon: '🥟', description: 'Famous Shenyang dumplings with pan-fried crispy bottom and juicy filling.', descriptionZh: '沈阳百年老字号，煸馅水饺皮薄馅鲜，是东北饺子文化的杰出代表。' },
  'Kunming|China': { name: 'Crossing-the-Bridge Noodles', nameZh: '过桥米线', icon: '🍜', description: 'Yunnan rice noodles served with a rich chicken broth and fresh ingredients.', descriptionZh: '云南经典美食，鸡汤鲜美，米线滑嫩，配以各色鲜料现烫现吃。' },
  'Xiamen|China': { name: 'Peanut Soup', nameZh: '花生汤', icon: '🥜', description: 'Sweet peanut soup, a traditional Xiamen dessert with soft, creamy peanuts.', descriptionZh: '厦门传统甜品，花生炖至酥烂，汤汁浓郁香甜，是闽南人的温暖记忆。' },
  'Qingdao|China': { name: 'Tsingtao Beer', nameZh: '青岛啤酒', icon: '🍺', description: 'China\'s most famous beer brand, brewed with Laoshan spring water since 1903.', descriptionZh: '中国最知名的啤酒品牌，1903年创建，以崂山泉水酿造，清冽醇厚。' },
  'Changsha|China': { name: 'Stinky Tofu', nameZh: '长沙臭豆腐', icon: '🧈', description: 'Fermented tofu deep-fried to crispy perfection, a beloved Changsha street food.', descriptionZh: '长沙最具特色的街头小吃，闻着臭吃着香，外焦里嫩。' },
  'Zhengzhou|China': { name: 'Braised Noodles', nameZh: '烩面', icon: '🍜', description: 'Thick hand-pulled noodles in rich lamb broth, a Henan comfort food.', descriptionZh: '河南名吃，宽面劲道，羊肉高汤浓郁，是中原人的家乡味。' },
  'Lhasa|China': { name: 'Yak Butter Tea', nameZh: '酥油茶', icon: '🍵', description: 'Traditional Tibetan drink made with yak butter and tea, rich and warming.', descriptionZh: '藏族传统饮品，用酥油与茶叶打制而成，浓香温暖，是高原生活的必需品。' },
  'Urumqi|China': { name: 'Naan Bread', nameZh: '馕', icon: '🫓', description: 'Traditional Uyghur flatbread baked in a tandoor, crispy and fragrant.', descriptionZh: '新疆传统主食，在馕坑中烤制而成，外酥内软，麦香浓郁。' },
  'Taipei|China': { name: 'Bubble Tea', nameZh: '珍珠奶茶', icon: '🧋', description: 'The original boba milk tea, born in Taiwan, with chewy tapioca pearls.', descriptionZh: '台湾发明的经典饮品，Q弹珍珠配以香浓奶茶，风靡全球。' },
  'Nanning|China': { name: 'Lao You Rice Noodles', nameZh: '老友粉', icon: '🍜', description: 'Sour and spicy rice noodles, Nanning\'s signature comfort food.', descriptionZh: '南宁最具代表性的米粉，酸辣鲜香，开胃驱寒，承载着老友情谊。' },
  'Guiyang|China': { name: 'Sour Soup Fish', nameZh: '酸汤鱼', icon: '🐟', description: 'Fresh fish in tangy tomato-based sour soup, a Guizhou classic.', descriptionZh: '贵州名菜，以苗族酸汤烹煮鲜鱼，酸辣适口，开胃爽口。' },
  'Lanzhou|China': { name: 'Lanzhou Beef Noodles', nameZh: '兰州牛肉面', icon: '🍜', description: 'Hand-pulled noodles in clear beef broth, Lanzhou\'s culinary pride.', descriptionZh: '兰州城市名片，一清二白三红四绿五黄，手工拉面配以牛肉清汤。' },
  'Hefei|China': { name: 'Lüan Melon Seeds', nameZh: '六安瓜片', icon: '🍵', description: 'Unique green tea made only from single leaves without stems or buds.', descriptionZh: '中国十大名茶之一，唯一无芽无梗的绿茶，形似瓜子，清香高爽。' },
  'Fuzhou|China': { name: 'Fish Ball', nameZh: '福州鱼丸', icon: '🍡', description: 'Bouncy fish balls stuffed with minced pork, a Fuzhou staple.', descriptionZh: '福州传统名吃，鱼肉打成弹牙丸子包以猪肉馅，汤鲜味美。' },
  'Nanchang|China': { name: 'Nanchang Mixed Noodles', nameZh: '南昌拌粉', icon: '🍝', description: 'Rice noodles mixed with soy sauce, chili, and sesame oil, a Nanchang breakfast classic.', descriptionZh: '南昌人的早餐标配，米粉拌以酱油辣椒芝麻油，简单却令人回味。' },
  'Jinan|China': { name: 'Sweet Potato Starch Jelly', nameZh: '济南甜沫', icon: '🥣', description: 'Savory millet porridge with vegetables and peanuts, a unique Jinan breakfast.', descriptionZh: '济南特色早餐，小米面糊配以粉条蔬菜花生，名甜实咸，别具风味。' },
  'Taiyuan|China': { name: 'Shanxi Sliced Noodles', nameZh: '山西刀削面', icon: '🍜', description: 'Hand-sliced noodles from a dough block, thick and chewy in rich broth.', descriptionZh: '山西面食代表，师傅手持刀具削面入锅，面叶中厚边薄，筋道爽滑。' },
  'Haikou|China': { name: 'Coconut Chicken Soup', nameZh: '椰子鸡', icon: '🥥', description: 'Fresh chicken simmered in coconut water, a Hainan island specialty.', descriptionZh: '海南招牌美食，用新鲜椰子水炖煮文昌鸡，清甜鲜美，热带风情满满。' },

  // ===== 日本 =====
  'Tokyo|Japan': { name: 'Tokyo Banana', nameZh: '东京香蕉蛋糕', icon: '🍌', description: 'Soft sponge cake filled with banana custard cream, Tokyo\'s most popular souvenir.', descriptionZh: '东京最受欢迎的伴手礼，香蕉奶油夹心海绵蛋糕，松软香甜。' },
  'Osaka|Japan': { name: 'Takoyaki', nameZh: '章鱼烧', icon: '🐙', description: 'Crispy ball-shaped snack filled with octopus, a symbol of Osaka street food.', descriptionZh: '大阪街头美食的象征，外酥内软的球形小吃，内含章鱼块。' },
  'Kyoto|Japan': { name: 'Yatsuhashi', nameZh: '八桥饼', icon: '🍡', description: 'Traditional Kyoto confection made from rice flour and cinnamon.', descriptionZh: '京都传统和菓子，以米粉和肉桂制成，有烤制和生八桥两种。' },
  'Sapporo|Japan': { name: 'Shiroi Koibito', nameZh: '白色恋人', icon: '🍪', description: 'White chocolate sandwich cookies, Hokkaido\'s beloved souvenir.', descriptionZh: '北海道代表性伴手礼，白巧克力夹心饼干，甜蜜浪漫。' },
  'Nagoya|Japan': { name: 'Miso Katsu', nameZh: '味噌猪排', icon: '🍖', description: 'Deep-fried pork cutlet topped with rich red miso sauce, Nagoya\'s signature dish.', descriptionZh: '名古屋名物，炸猪排淋上浓郁的红味噌酱，咸甜适口。' },
  'Fukuoka|Japan': { name: 'Hakata Ramen', nameZh: '博多拉面', icon: '🍜', description: 'Rich tonkotsu pork bone broth ramen with thin noodles, Fukuoka\'s pride.', descriptionZh: '福冈代表美食，浓郁猪骨汤底配细面，可追加替玉。' },
  'Kobe|Japan': { name: 'Kobe Beef', nameZh: '神户牛肉', icon: '🥩', description: 'World-renowned wagyu beef with exceptional marbling and melt-in-mouth texture.', descriptionZh: '世界顶级和牛，雪花纹理细腻，入口即化，是日本美食的巅峰。' },
  'Hiroshima|Japan': { name: 'Momiji Manju', nameZh: '红叶馒头', icon: '🍁', description: 'Maple leaf-shaped cakes filled with sweet red bean paste.', descriptionZh: '广岛宫岛名产，枫叶形状的小蛋糕，内含红豆馅，造型可爱。' },
  'Nara|Japan': { name: 'Kakinoha-zushi', nameZh: '柿叶寿司', icon: '🍣', description: 'Pressed sushi wrapped in persimmon leaves, a traditional Nara delicacy.', descriptionZh: '奈良传统美食，用柿子叶包裹的押寿司，叶香清雅。' },
  'Okinawa|Japan': { name: 'Purple Sweet Potato Tart', nameZh: '紫薯挞', icon: '🍠', description: 'Tart made with Okinawan purple sweet potato, vibrant color and sweet flavor.', descriptionZh: '冲绳特产甜品，用当地紫薯制成，色泽鲜艳，甜而不腻。' },

  // ===== 韩国 =====
  'Seoul|South Korea': { name: 'Kimchi', nameZh: '韩式泡菜', icon: '🥬', description: 'Fermented napa cabbage with chili, garlic and ginger, Korea\'s national food.', descriptionZh: '韩国国民美食，用辣椒大蒜生姜腌制的发酵白菜，餐餐必备。' },
  'Busan|South Korea': { name: 'Hotteok', nameZh: '釜山糖饼', icon: '🥞', description: 'Sweet Korean pancake filled with brown sugar and nuts, a Busan winter favorite.', descriptionZh: '釜山冬日街头美食，糯米面皮包裹红糖坚果馅，香甜酥脆。' },
  'Jeju|South Korea': { name: 'Hallabong Orange', nameZh: '汉拿峰柑橘', icon: '🍊', description: 'Sweet and juicy mandarin orange unique to Jeju Island.', descriptionZh: '济州岛特产柑橘，皮薄多汁，甜度极高，是济州的代名词。' },

  // ===== 东南亚 =====
  'Bangkok|Thailand': { name: 'Tom Yum Kung', nameZh: '冬阴功', icon: '🍲', description: 'Spicy and sour shrimp soup with lemongrass, a Thai culinary icon.', descriptionZh: '泰国国汤，以香茅柠檬叶等香料炖煮鲜虾，酸辣鲜香。' },
  'Singapore|Singapore': { name: 'Kaya Toast', nameZh: '咖椰吐司', icon: '🍞', description: 'Toasted bread with coconut jam and butter, Singapore\'s classic breakfast.', descriptionZh: '新加坡经典早餐，烤面包涂以椰子酱和黄油，配半熟蛋和咖啡。' },
  'Hanoi|Vietnam': { name: 'Pho', nameZh: '越南河粉', icon: '🍜', description: 'Aromatic rice noodle soup with herbs and beef or chicken, Vietnam\'s national dish.', descriptionZh: '越南国民美食，清香的牛骨汤配以河粉和新鲜香草，回味无穷。' },
  'Ho Chi Minh City|Vietnam': { name: 'Banh Mi', nameZh: '越南法棍三明治', icon: '🥖', description: 'Crispy baguette filled with pate, pickled vegetables and herbs.', descriptionZh: '法越融合美食，酥脆法棍夹以肉酱、腌菜和香草，层次丰富。' },
  'Kuala Lumpur|Malaysia': { name: 'Nasi Lemak', nameZh: '椰浆饭', icon: '🍚', description: 'Coconut milk rice with sambal, anchovies, peanuts and egg, Malaysia\'s national dish.', descriptionZh: '马来西亚国菜，椰浆煮饭配以叁巴酱、江鱼仔、花生和鸡蛋。' },
  'Jakarta|Indonesia': { name: 'Batik Fabric', nameZh: '蜡染布', icon: '🎨', description: 'Traditional Indonesian wax-resist dyed fabric, UNESCO cultural heritage.', descriptionZh: '印尼传统蜡染工艺品，2009年被列入联合国非物质文化遗产。' },
  'Manila|Philippines': { name: 'Dried Mango', nameZh: '芒果干', icon: '🥭', description: 'Sweet and chewy dried mangoes from the tropical Philippines.', descriptionZh: '菲律宾热带水果特产，香甜有嚼劲，是最受欢迎的伴手礼。' },
  'Phnom Penh|Cambodia': { name: 'Kampot Pepper', nameZh: '贡布胡椒', icon: '🌶', description: 'World-renowned pepper from Kampot, with complex floral and citrus notes.', descriptionZh: '柬埔寨贡布省出产的顶级胡椒，风味复杂带花果香，被誉为世界最好的胡椒。' },

  // ===== 欧洲 =====
  'Paris|France': { name: 'Macaron', nameZh: '马卡龙', icon: '🧁', description: 'Colorful meringue-based sandwich cookies, a symbol of French patisserie.', descriptionZh: '法式甜点的象征，色彩缤纷的杏仁蛋白饼，外酥内软，甜蜜优雅。' },
  'London|United Kingdom': { name: 'English Tea', nameZh: '英式红茶', icon: '🫖', description: 'Traditional English afternoon tea blend, a cornerstone of British culture.', descriptionZh: '英国文化的重要组成部分，经典红茶搭配下午茶点心，优雅惬意。' },
  'Rome|Italy': { name: 'Pasta', nameZh: '意大利面', icon: '🍝', description: 'Authentic Italian pasta in hundreds of shapes, the heart of Italian cuisine.', descriptionZh: '意大利美食的灵魂，数百种面型各具特色，搭配各式酱汁。' },
  'Barcelona|Spain': { name: 'Turron', nameZh: '杜伦糖', icon: '🍬', description: 'Traditional Spanish nougat made with almonds and honey.', descriptionZh: '西班牙传统甜点，以杏仁和蜂蜜制成的牛轧糖，圣诞必备。' },
  'Madrid|Spain': { name: 'Churros', nameZh: '吉拿棒', icon: '🍩', description: 'Fried dough pastry dipped in thick hot chocolate, a Madrid tradition.', descriptionZh: '马德里传统小吃，油条状糕点蘸浓热巧克力，香脆甜蜜。' },
  'Berlin|Germany': { name: 'Currywurst', nameZh: '咖喱香肠', icon: '🌭', description: 'Sliced pork sausage with curry ketchup, Berlin\'s iconic street food.', descriptionZh: '柏林标志性街头美食，切片猪肉香肠配以咖喱番茄酱。' },
  'Munich|Germany': { name: 'Pretzel', nameZh: '椒盐脆饼', icon: '🥨', description: 'Traditional Bavarian twisted bread, crispy outside and soft inside.', descriptionZh: '巴伐利亚传统面包，麻花形状，外脆内软，撒以粗盐。' },
  'Vienna|Austria': { name: 'Sachertorte', nameZh: '萨赫蛋糕', icon: '🎂', description: 'Legendary Viennese chocolate cake with apricot jam, created in 1832.', descriptionZh: '维也纳传奇甜点，巧克力蛋糕夹以杏酱，1832年首创至今。' },
  'Amsterdam|Netherlands': { name: 'Stroopwafel', nameZh: '焦糖华夫饼', icon: '🧇', description: 'Thin waffle cookies with caramel syrup filling, a Dutch classic.', descriptionZh: '荷兰经典甜点，两片薄华夫饼夹以焦糖糖浆，甜蜜酥脆。' },
  'Brussels|Belgium': { name: 'Belgian Chocolate', nameZh: '比利时巧克力', icon: '🍫', description: 'World-class handcrafted chocolates, Belgium\'s proudest export.', descriptionZh: '世界顶级手工巧克力，比利时最引以为豪的出口品。' },
  'Zurich|Switzerland': { name: 'Swiss Chocolate', nameZh: '瑞士巧克力', icon: '🍫', description: 'Premium Swiss chocolate, smooth and rich, a tradition since the 19th century.', descriptionZh: '瑞士顶级巧克力，丝滑醇厚，自19世纪传承至今的制造工艺。' },
  'Prague|Czech Republic': { name: 'Trdelnik', nameZh: '烟囱卷', icon: '🥐', description: 'Sweet pastry rolled on a stick and grilled, coated in sugar and nuts.', descriptionZh: '捷克传统甜点，面团裹在木棒上烤制，撒上糖和坚果碎。' },
  'Lisbon|Portugal': { name: 'Pastel de Nata', nameZh: '葡式蛋挞', icon: '🥧', description: 'Flaky pastry shell filled with egg custard, Portugal\'s beloved dessert.', descriptionZh: '葡萄牙国宝级甜点，酥脆蛋挞壳配以焦糖蛋奶馅，源自贝伦修道院。' },
  'Istanbul|Turkey': { name: 'Turkish Delight', nameZh: '土耳其软糖', icon: '🍬', description: 'Soft, chewy confection dusted with powdered sugar, flavored with rosewater.', descriptionZh: '土耳其传统甜食，软糯有嚼劲，撒以糖粉，玫瑰水调味。' },
  'Moscow|Russia': { name: 'Matryoshka Doll', nameZh: '套娃', icon: '🪆', description: 'Traditional Russian wooden nesting dolls, each containing a smaller figure inside.', descriptionZh: '俄罗斯传统木制工艺品，一个套一个的彩绘娃娃，象征家庭和丰收。' },
  'Athens|Greece': { name: 'Olive Oil', nameZh: '希腊橄榄油', icon: '🫒', description: 'Premium extra virgin olive oil from ancient Greek olive groves.', descriptionZh: '希腊顶级特级初榨橄榄油，产自千年古老橄榄林，风味醇厚。' },
  'Copenhagen|Denmark': { name: 'Danish Pastry', nameZh: '丹麦酥', icon: '🥐', description: 'Buttery, flaky laminated pastry, a Danish baking tradition.', descriptionZh: '丹麦传统烘焙，层层黄油酥皮，松脆香甜。' },
  'Stockholm|Sweden': { name: 'Swedish Meatballs', nameZh: '瑞典肉丸', icon: '🍖', description: 'Tender meatballs with lingonberry sauce and cream gravy.', descriptionZh: '瑞典经典菜肴，鲜嫩肉丸搭配越橘酱和奶油汁。' },
  'Helsinki|Finland': { name: 'Salmiakki', nameZh: '咸甘草糖', icon: '🍬', description: 'Salty licorice candy, a uniquely Finnish taste experience.', descriptionZh: '芬兰特色糖果，咸味甘草风味，是芬兰人最爱的独特零食。' },
  'Oslo|Norway': { name: 'Brown Cheese', nameZh: '棕色奶酪', icon: '🧀', description: 'Caramelized whey cheese with a sweet, fudge-like flavor, a Norwegian staple.', descriptionZh: '挪威国民奶酪，焦糖色的乳清奶酪，甜美如太妃糖。' },
  'Warsaw|Poland': { name: 'Pierogi', nameZh: '波兰饺子', icon: '🥟', description: 'Traditional Polish dumplings with various fillings from potato to fruit.', descriptionZh: '波兰传统饺子，馅料多样，从土豆奶酪到水果，是波兰人的灵魂食物。' },
  'Budapest|Hungary': { name: 'Chimney Cake', nameZh: '烟囱蛋糕', icon: '🍰', description: 'Cylindrical pastry coated in sugar, a beloved Hungarian street food.', descriptionZh: '匈牙利传统甜点，圆筒形面包裹以糖衣，外酥内软，街头飘香。' },
  'Edinburgh|United Kingdom': { name: 'Scotch Whisky', nameZh: '苏格兰威士忌', icon: '🥃', description: 'World-renowned malt whisky aged in oak barrels, Scotland\'s liquid gold.', descriptionZh: '世界闻名的麦芽威士忌，橡木桶中陈酿而成，苏格兰的液体黄金。' },

  // ===== 北美 =====
  'New York|United States': { name: 'New York Cheesecake', nameZh: '纽约芝士蛋糕', icon: '🍰', description: 'Dense, creamy cheesecake, a New York classic since the 1900s.', descriptionZh: '纽约经典甜品，口感厚实绵密的芝士蛋糕，醇香浓郁。' },
  'Los Angeles|United States': { name: 'In-N-Out Burger', nameZh: 'In-N-Out汉堡', icon: '🍔', description: 'Iconic West Coast burger chain with fresh, never-frozen beef patties.', descriptionZh: '西海岸传奇汉堡，新鲜牛肉现做现烤，是洛杉矶美食文化的代表。' },
  'Chicago|United States': { name: 'Deep Dish Pizza', nameZh: '芝加哥深盘披萨', icon: '🍕', description: 'Thick-crusted pizza baked in a deep pan with layers of cheese and sauce.', descriptionZh: '芝加哥招牌美食，厚底深盘中堆叠芝士与酱料，浓郁饱满。' },
  'San Francisco|United States': { name: 'Sourdough Bread', nameZh: '酸面包', icon: '🍞', description: 'Tangy sourdough bread, a San Francisco tradition since the Gold Rush.', descriptionZh: '旧金山传统面包，自淘金热时代传承的天然酵母面包，微酸醇香。' },
  'Washington|United States': { name: 'Half-Smoke Sausage', nameZh: '半烟肠', icon: '🌭', description: 'Spicy smoked sausage, the unofficial food of Washington D.C.', descriptionZh: '华盛顿非官方代表食物，辛辣烟熏香肠，通常配以辣椒酱。' },
  'Seattle|United States': { name: 'Starbucks Coffee', nameZh: '星巴克咖啡', icon: '☕', description: 'The original Starbucks coffee from Pike Place Market, Seattle\'s gift to the world.', descriptionZh: '星巴克发源地，派克市场的第一家店，西雅图送给世界的咖啡文化。' },
  'Las Vegas|United States': { name: 'Casino Chip', nameZh: '赌场筹码', icon: '🎰', description: 'Souvenir casino chips from the Entertainment Capital of the World.', descriptionZh: '来自世界娱乐之都的纪念赌场筹码，记录着拉斯维加斯的不夜传奇。' },
  'Miami|United States': { name: 'Key Lime Pie', nameZh: '青柠派', icon: '🥧', description: 'Tangy lime pie with graham cracker crust, a Florida Keys specialty.', descriptionZh: '佛罗里达群岛特色甜品，酸甜的青柠馅配以全麦饼干底。' },
  'Honolulu|United States': { name: 'Macadamia Nuts', nameZh: '夏威夷果', icon: '🥜', description: 'Buttery macadamia nuts, Hawaii\'s most popular edible souvenir.', descriptionZh: '夏威夷最受欢迎的特产，奶油般香浓的坚果，口感酥脆。' },
  'Toronto|Canada': { name: 'Maple Syrup', nameZh: '枫糖浆', icon: '🍁', description: 'Pure Canadian maple syrup, harvested from maple trees in spring.', descriptionZh: '加拿大纯正枫糖浆，春季从枫树中采集，琥珀色泽，甜蜜自然。' },
  'Vancouver|Canada': { name: 'Smoked Salmon', nameZh: '烟熏三文鱼', icon: '🐟', description: 'Pacific wild smoked salmon, a staple of British Columbia cuisine.', descriptionZh: '太平洋野生烟熏三文鱼，不列颠哥伦比亚省的特色美味。' },
  'Mexico City|Mexico': { name: 'Taco', nameZh: '墨西哥卷饼', icon: '🌮', description: 'Corn tortilla filled with various meats and salsa, Mexico\'s iconic food.', descriptionZh: '墨西哥标志性食物，玉米饼包裹各式肉类和莎莎酱，风味多样。' },

  // ===== 南美 =====
  'Buenos Aires|Argentina': { name: 'Dulce de Leche', nameZh: '焦糖牛奶酱', icon: '🥛', description: 'Caramelized milk spread, Argentina\'s sweet obsession used in every dessert.', descriptionZh: '阿根廷国民甜品，牛奶慢熬成焦糖酱，几乎用于所有甜点中。' },
  'Rio de Janeiro|Brazil': { name: 'Brigadeiro', nameZh: '巧克力球', icon: '🍫', description: 'Brazilian chocolate truffle made from condensed milk and cocoa powder.', descriptionZh: '巴西国民甜食，用炼乳和可可粉制成的巧克力球，甜蜜可爱。' },
  'São Paulo|Brazil': { name: 'Pão de Queijo', nameZh: '芝士面包球', icon: '🧀', description: 'Brazilian cheese bread balls made with tapioca flour, chewy and cheesy.', descriptionZh: '巴西传统芝士面包球，以木薯粉制成，外脆内糯，芝士味浓郁。' },
  'Lima|Peru': { name: 'Ceviche', nameZh: '酸橘汁腌鱼', icon: '🐟', description: 'Fresh raw fish cured in citrus juices, Peru\'s national dish.', descriptionZh: '秘鲁国菜，新鲜生鱼片以柑橘汁腌制，清爽酸鲜。' },
  'Bogota|Colombia': { name: 'Colombian Coffee', nameZh: '哥伦比亚咖啡', icon: '☕', description: 'Premium arabica coffee from the Colombian highlands, world-renowned.', descriptionZh: '产自哥伦比亚高原的顶级阿拉比卡咖啡，醇厚芬芳，享誉世界。' },

  // ===== 非洲 =====
  'Cairo|Egypt': { name: 'Papyrus Art', nameZh: '莎草纸画', icon: '📜', description: 'Hand-painted art on traditional papyrus paper, depicting ancient Egyptian scenes.', descriptionZh: '手绘莎草纸艺术品，描绘古埃及场景，承载千年文明。' },
  'Cape Town|South Africa': { name: 'Rooibos Tea', nameZh: '路易波士茶', icon: '🍵', description: 'Caffeine-free herbal tea unique to South Africa\'s Cederberg region.', descriptionZh: '南非特有的无咖啡因草本茶，产自塞德伯格山区，口感柔和甘甜。' },
  'Marrakech|Morocco': { name: 'Argan Oil', nameZh: '摩洛哥坚果油', icon: '🫒', description: 'Precious oil from argan tree nuts, used in cooking and beauty.', descriptionZh: '摩洛哥珍贵的坚果油，可食用也可护肤，被称为"液体黄金"。' },
  'Nairobi|Kenya': { name: 'Kenyan Coffee', nameZh: '肯尼亚咖啡', icon: '☕', description: 'Bold, fruity coffee from Kenya\'s highlands, one of the world\'s finest.', descriptionZh: '产自肯尼亚高原的精品咖啡，果味浓郁，是世界最优质的咖啡之一。' },

  // ===== 大洋洲 =====
  'Sydney|Australia': { name: 'Tim Tam', nameZh: 'Tim Tam巧克力饼', icon: '🍪', description: 'Iconic Australian chocolate biscuit with layers of cream and chocolate coating.', descriptionZh: '澳大利亚国民饼干，巧克力涂层夹心饼干，甜蜜酥脆。' },
  'Melbourne|Australia': { name: 'Flat White Coffee', nameZh: '馥芮白咖啡', icon: '☕', description: 'Velvety espresso-based coffee, born from Melbourne\'s vibrant cafe culture.', descriptionZh: '源自墨尔本咖啡文化的经典饮品，细腻丝滑的浓缩牛奶咖啡。' },
  'Auckland|New Zealand': { name: 'Manuka Honey', nameZh: '麦卢卡蜂蜜', icon: '🍯', description: 'Premium honey from the native manuka bush, prized for its unique properties.', descriptionZh: '新西兰独有的麦卢卡蜂蜜，来自本土麦卢卡灌木，珍贵且独特。' },

  // ===== 中东 =====
  'Dubai|United Arab Emirates': { name: 'Gold Souk Jewelry', nameZh: '黄金市集饰品', icon: '💍', description: 'Exquisite gold jewelry from Dubai\'s famous Gold Souk market.', descriptionZh: '迪拜著名黄金市集的精美金饰，工艺精湛，璀璨夺目。' },

  // ===== 印度 =====
  'Mumbai|India': { name: 'Masala Chai', nameZh: '印度奶茶', icon: '🍵', description: 'Spiced tea with milk, cardamom and ginger, India\'s beloved daily drink.', descriptionZh: '印度国民饮品，红茶配以牛奶、豆蔻和姜等香料，浓郁温暖。' },
  'New Delhi|India': { name: 'Sari Fabric', nameZh: '纱丽织物', icon: '🧣', description: 'Beautiful handwoven silk fabric in vibrant colors, traditional Indian garment.', descriptionZh: '印度传统服饰面料，手工织造的丝绸，色彩鲜艳，精美绝伦。' },
}

/** 根据城市信息获取特产。如果没有预定义，则基于城市描述生成一个 */
export function getSpecialtyForCity(cityName: string, country: string, nameZh?: string, description?: string): SpecialtyInfo {
  const key = `${cityName}|${country}`
  if (specialtyMap[key]) return specialtyMap[key]

  // Fallback: generate a generic specialty based on region/country
  return generateFallbackSpecialty(cityName, country, nameZh, description)
}

function generateFallbackSpecialty(cityName: string, country: string, nameZh?: string, description?: string): SpecialtyInfo {
  // Country-based fallback specialties
  const countryFallbacks: Record<string, SpecialtyInfo> = {
    'China': { name: 'Local Tea', nameZh: '当地名茶', icon: '🍵', description: `Fine tea leaves from ${cityName}, carrying the unique flavor of the region.`, descriptionZh: `${nameZh || cityName}当地出产的优质茶叶，带有独特的地域风味。` },
    'Japan': { name: 'Wagashi', nameZh: '和菓子', icon: '🍡', description: `Traditional Japanese confection from ${cityName}, crafted with seasonal ingredients.`, descriptionZh: `${nameZh || cityName}的传统和菓子，以当季食材精心制作。` },
    'South Korea': { name: 'Rice Cake', nameZh: '年糕', icon: '🍡', description: `Traditional Korean rice cake from ${cityName}, soft and chewy.`, descriptionZh: `${nameZh || cityName}的传统年糕，软糯可口。` },
    'United States': { name: 'Local Craft Beer', nameZh: '当地精酿啤酒', icon: '🍺', description: `Craft beer from ${cityName}'s local breweries, with unique regional character.`, descriptionZh: `${nameZh || cityName}当地酿酒厂出品的精酿啤酒，具有独特的地域特色。` },
    'France': { name: 'Local Cheese', nameZh: '当地奶酪', icon: '🧀', description: `Artisanal cheese from the ${cityName} region, rich in local terroir.`, descriptionZh: `${nameZh || cityName}地区的手工奶酪，蕴含当地风土特色。` },
    'Italy': { name: 'Local Wine', nameZh: '当地葡萄酒', icon: '🍷', description: `Fine wine from ${cityName}'s vineyards, reflecting Italian winemaking tradition.`, descriptionZh: `${nameZh || cityName}葡萄园出产的优质葡萄酒，传承意大利酿酒传统。` },
    'Germany': { name: 'Local Sausage', nameZh: '当地香肠', icon: '🌭', description: `Traditional sausage from ${cityName}, crafted with local recipes.`, descriptionZh: `${nameZh || cityName}的传统香肠，以当地秘方制作。` },
    'Spain': { name: 'Local Olive Oil', nameZh: '当地橄榄油', icon: '🫒', description: `Premium olive oil from the ${cityName} region.`, descriptionZh: `${nameZh || cityName}地区出产的优质橄榄油。` },
    'India': { name: 'Local Spices', nameZh: '当地香料', icon: '🌶', description: `Aromatic spice blend unique to the ${cityName} region.`, descriptionZh: `${nameZh || cityName}地区独特的芳香香料组合。` },
    'Thailand': { name: 'Thai Silk', nameZh: '泰丝', icon: '🧣', description: `Hand-woven Thai silk from ${cityName}, lustrous and elegant.`, descriptionZh: `${nameZh || cityName}的手工泰丝，光泽优雅。` },
    'Australia': { name: 'Local Honey', nameZh: '当地蜂蜜', icon: '🍯', description: `Pure bush honey from the ${cityName} region, with native floral notes.`, descriptionZh: `${nameZh || cityName}地区的纯正丛林蜂蜜，带有当地花卉芬芳。` },
    'Brazil': { name: 'Cachaça', nameZh: '卡夏莎甘蔗酒', icon: '🥃', description: `Brazilian sugarcane spirit from ${cityName}, the base of caipirinha.`, descriptionZh: `${nameZh || cityName}出产的巴西甘蔗酒，是卡匹林纳鸡尾酒的基酒。` },
    'Mexico': { name: 'Hot Sauce', nameZh: '辣酱', icon: '🌶', description: `Artisanal hot sauce from ${cityName}, made with local chili peppers.`, descriptionZh: `${nameZh || cityName}的手工辣酱，选用当地辣椒制作。` },
    'Canada': { name: 'Ice Wine', nameZh: '冰酒', icon: '🍷', description: `Sweet ice wine from ${cityName}'s cold-climate vineyards.`, descriptionZh: `${nameZh || cityName}寒冷气候葡萄园出产的甜冰酒。` },
    'United Kingdom': { name: 'Local Biscuits', nameZh: '当地饼干', icon: '🍪', description: `Traditional biscuits from ${cityName}, perfect with afternoon tea.`, descriptionZh: `${nameZh || cityName}的传统饼干，配下午茶的完美选择。` },
    'Russia': { name: 'Vodka', nameZh: '伏特加', icon: '🥃', description: `Premium vodka from ${cityName}, crystal clear and smooth.`, descriptionZh: `${nameZh || cityName}出产的优质伏特加，清澈顺滑。` },
    'Egypt': { name: 'Perfume Oil', nameZh: '精油香水', icon: '🧴', description: `Traditional perfume oil from ${cityName}, fragrant and long-lasting.`, descriptionZh: `${nameZh || cityName}的传统精油香水，芬芳持久。` },
    'South Africa': { name: 'Dried Biltong', nameZh: '风干肉干', icon: '🥩', description: `Traditional cured and dried meat from ${cityName}.`, descriptionZh: `${nameZh || cityName}的传统风干肉干，咸香有嚼劲。` },
    'New Zealand': { name: 'Kiwi Fruit Jam', nameZh: '奇异果酱', icon: '🥝', description: `Fresh kiwi fruit preserve from ${cityName}.`, descriptionZh: `${nameZh || cityName}的新鲜奇异果果酱，酸甜可口。` },
    'Vietnam': { name: 'Vietnamese Coffee', nameZh: '越南咖啡', icon: '☕', description: `Strong drip coffee from ${cityName}, brewed with condensed milk.`, descriptionZh: `${nameZh || cityName}的滴漏咖啡，配以炼乳，浓郁甜蜜。` },
    'Indonesia': { name: 'Batik Craft', nameZh: '蜡染工艺品', icon: '🎨', description: `Traditional batik art from ${cityName}.`, descriptionZh: `${nameZh || cityName}的传统蜡染艺术品。` },
    'Malaysia': { name: 'White Coffee', nameZh: '白咖啡', icon: '☕', description: `Traditional white coffee from ${cityName}.`, descriptionZh: `${nameZh || cityName}的传统白咖啡，顺滑醇厚。` },
    'Philippines': { name: 'Dried Fruit', nameZh: '热带水果干', icon: '🥭', description: `Tropical dried fruits from ${cityName}.`, descriptionZh: `${nameZh || cityName}的热带水果干，天然甜蜜。` },
    'Turkey': { name: 'Turkish Delight', nameZh: '土耳其软糖', icon: '🍬', description: `Traditional confection from ${cityName}.`, descriptionZh: `${nameZh || cityName}的传统软糖。` },
    'Nigeria': { name: 'Kola Nut', nameZh: '可乐果', icon: '🥜', description: `Traditional kola nut from ${cityName}, a symbol of hospitality.`, descriptionZh: `${nameZh || cityName}的传统可乐果，象征热情好客。` },
    'Argentina': { name: 'Yerba Mate', nameZh: '马黛茶', icon: '🧉', description: `Traditional mate tea from ${cityName}.`, descriptionZh: `${nameZh || cityName}的传统马黛茶，提神醒脑。` },
    'Poland': { name: 'Amber Jewelry', nameZh: '琥珀饰品', icon: '💎', description: `Baltic amber jewelry from ${cityName}.`, descriptionZh: `${nameZh || cityName}的波罗的海琥珀饰品，古朴典雅。` },
    'Kenya': { name: 'Kenyan Tea', nameZh: '肯尼亚红茶', icon: '🍵', description: `Premium black tea from ${cityName}'s highlands.`, descriptionZh: `${nameZh || cityName}高原出产的优质红茶。` },
    'Colombia': { name: 'Emerald', nameZh: '祖母绿宝石', icon: '💎', description: `Precious emerald gemstone from ${cityName}.`, descriptionZh: `${nameZh || cityName}出产的珍贵祖母绿宝石。` },
    'Peru': { name: 'Alpaca Scarf', nameZh: '羊驼围巾', icon: '🧣', description: `Soft alpaca wool scarf from ${cityName}.`, descriptionZh: `${nameZh || cityName}的柔软羊驼毛围巾，温暖亲肤。` },
  }

  if (countryFallbacks[country]) {
    return countryFallbacks[country]
  }

  // Ultimate fallback
  return {
    name: 'Local Souvenir',
    nameZh: '当地纪念品',
    icon: '🎁',
    description: `A unique souvenir from ${cityName}, ${country}, capturing the spirit of this destination.`,
    descriptionZh: `来自${nameZh || cityName}的独特纪念品，记录着旅途的美好回忆。`,
  }
}
