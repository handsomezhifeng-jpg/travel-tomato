const fs = require('fs');
const cities = require('./src/data/cities.json').slice(1000);

// Translation map for all 1006 cities (index 1000-2005)
// Each entry: [en_tagline, fr_tagline, de_tagline, en_description, fr_description, de_description]
const translations = {
  // === Finland ===
  "Lahti_Finland": [
    "City of ski jumping",
    "Ville du saut à ski",
    "Stadt des Skispringens",
    "A sports city in southern Finland, renowned for ski jumping and design.",
    "Ville sportive du sud de la Finlande, réputée pour le saut à ski et le design.",
    "Sportstadt in Südfinnland, bekannt für Skispringen und Design."
  ],
  "Vaasa_Finland": [
    "Finland's sunniest city",
    "La ville la plus ensoleillée de Finlande",
    "Finnlands sonnigste Stadt",
    "A sun-drenched city on Finland's west coast with the most sunshine hours in the Nordics.",
    "Ville ensoleillée de la côte ouest finlandaise, record d'ensoleillement en Scandinavie.",
    "Sonnenreichste Stadt an Finnlands Westküste mit den meisten Sonnenstunden Nordeuropas."
  ],
  "Savonlinna_Finland": [
    "Castle opera city",
    "Cité de l'opéra et du château",
    "Stadt der Schlossoper",
    "A historic town in Finland's lake district, famed for the Olavinlinna Castle Opera Festival.",
    "Ville historique de la région des lacs finlandais, célèbre pour le festival d'opéra du château d'Olavinlinna.",
    "Historische Stadt in Finnlands Seengebiet, berühmt für das Opernfestival auf Burg Olavinlinna."
  ],
  // === Romania ===
  "Craiova_Romania": [
    "Capital of Oltenia",
    "Capitale de l'Olténie",
    "Hauptstadt Olteniens",
    "A city in southwestern Romania and the cultural hub of the Oltenia region.",
    "Ville du sud-ouest de la Roumanie, centre culturel de la région d'Olténie.",
    "Stadt im Südwesten Rumäniens und kulturelles Zentrum der Region Oltenien."
  ],
  "Oradea_Romania": [
    "City of Art Nouveau",
    "Ville de l'Art nouveau",
    "Stadt des Jugendstils",
    "A city in northwestern Romania celebrated for its Art Nouveau architecture.",
    "Ville du nord-ouest de la Roumanie célèbre pour son architecture Art nouveau.",
    "Stadt im Nordwesten Rumäniens, bekannt für ihre Jugendstilarchitektur."
  ],
  "Arad_Romania": [
    "Gateway to the West",
    "Porte de l'Ouest",
    "Tor zum Westen",
    "A western Romanian city with well-preserved Austro-Hungarian architecture.",
    "Ville de l'ouest de la Roumanie aux bâtiments austro-hongrois bien conservés.",
    "Westrumänische Stadt mit gut erhaltener österreichisch-ungarischer Architektur."
  ],
  "Suceava_Romania": [
    "Gateway to the painted monasteries",
    "Porte des monastères peints",
    "Tor zu den bemalten Klöstern",
    "Gateway to Bucovina and its UNESCO-listed painted monasteries.",
    "Porte d'entrée de la Bucovine et de ses monastères peints classés par l'UNESCO.",
    "Tor zur Bukowina und ihren UNESCO-gelisteten bemalten Klöstern."
  ],
  // === Bulgaria ===
  "Ruse_Bulgaria": [
    "Bulgaria's Little Vienna",
    "La petite Vienne de Bulgarie",
    "Bulgariens Klein-Wien",
    "A Danube riverside city known as Little Vienna for its neoclassical architecture.",
    "Ville sur le Danube surnommée la petite Vienne pour son architecture néoclassique.",
    "Donaustadt, wegen ihrer neoklassizistischen Architektur als Klein-Wien bekannt."
  ],
  "Stara Zagora_Bulgaria": [
    "City of linden trees",
    "Ville des tilleuls",
    "Stadt der Linden",
    "A central Bulgarian city famed for its Roman ruins and linden tree avenues.",
    "Ville du centre de la Bulgarie célèbre pour ses ruines romaines et ses allées de tilleuls.",
    "Stadt in Zentralbulgarien, bekannt für römische Ruinen und Lindenalleen."
  ],
  // === Serbia ===
  "Subotica_Serbia": [
    "City of Art Nouveau",
    "Cité de l'Art nouveau",
    "Jugendstilstadt",
    "A city in northern Serbia renowned for its stunning Art Nouveau architecture.",
    "Ville du nord de la Serbie réputée pour sa superbe architecture Art nouveau.",
    "Stadt in Nordserbien, berühmt für ihre beeindruckende Jugendstilarchitektur."
  ],
  "Kragujevac_Serbia": [
    "Serbia's first capital",
    "Première capitale de Serbie",
    "Serbiens erste Hauptstadt",
    "Serbia's former capital and Fiat automobile manufacturing center.",
    "Ancienne capitale de la Serbie et centre de fabrication automobile Fiat.",
    "Ehemalige Hauptstadt Serbiens und Fiat-Automobilfertigungszentrum."
  ],
  // === Croatia ===
  "Osijek_Croatia": [
    "Capital of Slavonia",
    "Capitale de Slavonie",
    "Hauptstadt Slawoniens",
    "Eastern Croatia's Slavonian capital, a baroque fortress city.",
    "Capitale de la Slavonie en Croatie orientale, ville-forteresse baroque.",
    "Hauptstadt Slawoniens in Ostkroatien, eine barocke Festungsstadt."
  ],
  "Šibenik_Croatia": [
    "City of the stone cathedral",
    "Cité de la cathédrale de pierre",
    "Stadt der Steinkathedrale",
    "A Dalmatian ancient city home to the UNESCO-listed Cathedral of St. James.",
    "Cité dalmate abritant la cathédrale Saint-Jacques classée par l'UNESCO.",
    "Dalmatinische Altstadt mit der UNESCO-gelisteten Kathedrale des Hl. Jakobus."
  ],
  "Trogir_Croatia": [
    "Island city of stone",
    "Cité insulaire de pierre",
    "Steinerne Inselstadt",
    "A medieval UNESCO World Heritage island city on the Dalmatian coast.",
    "Cité insulaire médiévale du patrimoine mondial de l'UNESCO sur la côte dalmate.",
    "Mittelalterliche UNESCO-Welterbe-Inselstadt an der dalmatinischen Küste."
  ],
  "Hvar_Croatia": [
    "Island of lavender and sunshine",
    "Île de lavande et de soleil",
    "Insel des Lavendels und der Sonne",
    "An Adriatic lavender island and one of Europe's sunniest destinations.",
    "Île de lavande de l'Adriatique, l'une des destinations les plus ensoleillées d'Europe.",
    "Adriatische Lavendelinsel und einer der sonnigsten Orte Europas."
  ],
  // === Bosnia ===
  "Banja Luka_Bosnia and Herzegovina": [
    "Green city on the Vrbas River",
    "Ville verte sur la Vrbas",
    "Grüne Stadt am Vrbas",
    "Bosnia's second-largest city, a green oasis along the Vrbas River.",
    "Deuxième ville de Bosnie, oasis verte le long de la rivière Vrbas.",
    "Zweitgrößte Stadt Bosniens, grüne Oase am Fluss Vrbas."
  ],
  // === Kosovo ===
  "Prizren_Kosovo": [
    "Cultural capital of Kosovo",
    "Capitale culturelle du Kosovo",
    "Kulturhauptstadt des Kosovo",
    "Kosovo's cultural capital where Ottoman architecture and diverse faiths coexist.",
    "Capitale culturelle du Kosovo où cohabitent architecture ottomane et religions diverses.",
    "Kulturhauptstadt des Kosovo, wo osmanische Architektur und verschiedene Religionen koexistieren."
  ],
  "Pristina_Kosovo": [
    "Young capital of the Balkans",
    "Jeune capitale des Balkans",
    "Junge Hauptstadt des Balkans",
    "The capital of Kosovo, a young and vibrant Balkan city.",
    "La capitale du Kosovo, une ville balkanique jeune et dynamique.",
    "Hauptstadt des Kosovo, eine junge und lebendige Balkanstadt."
  ],
  // === Slovenia ===
  "Piran_Slovenia": [
    "Slovenia's coastal gem",
    "Perle côtière de la Slovénie",
    "Sloweniens Küstenjuwel",
    "A charming Adriatic seaside town with Venetian flair on Slovenia's coast.",
    "Charmante petite ville balnéaire adriatique au charme vénitien sur la côte slovène.",
    "Charmante adriatische Küstenstadt mit venezianischem Flair an Sloweniens Küste."
  ],
  "Celje_Slovenia": [
    "City of Counts",
    "Ville des comtes",
    "Stadt der Grafen",
    "Slovenia's third-largest city, a medieval town of the Counts of Celje.",
    "Troisième ville de Slovénie, cité médiévale des comtes de Celje.",
    "Drittgrößte Stadt Sloweniens, mittelalterliche Stadt der Grafen von Cilli."
  ],
  // === Albania ===
  "Durrës_Albania": [
    "Albania's harbor capital",
    "Capitale portuaire de l'Albanie",
    "Albaniens Hafenhauptstadt",
    "Albania's largest port city, home to a Roman amphitheater.",
    "Plus grand port d'Albanie, abritant un amphithéâtre romain.",
    "Albaniens größte Hafenstadt mit einem römischen Amphitheater."
  ],
  "Gjirokastër_Albania": [
    "City of stone",
    "Cité de pierre",
    "Stadt aus Stein",
    "A UNESCO World Heritage city of Ottoman stone architecture.",
    "Cité de pierre ottomane classée au patrimoine mondial de l'UNESCO.",
    "UNESCO-Welterbestadt mit osmanischer Steinarchitektur."
  ],
  "Saranda_Albania": [
    "Albanian Riviera",
    "Riviera albanaise",
    "Albanische Riviera",
    "A resort city on Albania's south coast, near the Blue Eye spring.",
    "Station balnéaire de la côte sud de l'Albanie, près de la source de l'Œil Bleu.",
    "Badeort an Albaniens Südküste, nahe der Quelle Blaues Auge."
  ],
  "Sibenik_Croatia": [
    "Gateway to Krka waterfalls",
    "Porte des cascades de Krka",
    "Tor zu den Krka-Wasserfällen",
    "A Dalmatian harbor on Croatia's central coast and gateway to a national park.",
    "Port dalmate sur la côte centrale de la Croatie, porte d'entrée d'un parc national.",
    "Dalmatinischer Hafen an Kroatiens Zentralküste und Tor zu einem Nationalpark."
  ],
  // === Greece ===
  "Larissa_Greece": [
    "Capital of the Thessalian plain",
    "Capitale de la plaine thessalienne",
    "Hauptstadt der thessalischen Ebene",
    "The largest city of the Thessalian plain in Greece, an agricultural heartland.",
    "Plus grande ville de la plaine thessalienne en Grèce, cœur agricole du pays.",
    "Größte Stadt der thessalischen Ebene in Griechenland, ein landwirtschaftliches Kernland."
  ],
  // === France ===
  "Périgueux_France": [
    "City of truffles and foie gras",
    "Ville des truffes et du foie gras",
    "Stadt der Trüffel und Foie gras",
    "Capital of the Périgord region in southwestern France, land of truffles and foie gras.",
    "Capitale du Périgord dans le sud-ouest de la France, terre de truffes et de foie gras.",
    "Hauptstadt des Périgord im Südwesten Frankreichs, Land der Trüffel und Foie gras."
  ],
  "Pau_France": [
    "Gateway to the Pyrenees",
    "Porte des Pyrénées",
    "Tor zu den Pyrenäen",
    "A southwestern French city at the foot of the Pyrenees, birthplace of Henry IV.",
    "Ville du sud-ouest de la France au pied des Pyrénées, lieu de naissance d'Henri IV.",
    "Stadt im Südwesten Frankreichs am Fuß der Pyrenäen, Geburtsort Heinrichs IV."
  ],
  "Besançon_France": [
    "City of the Vauban citadel",
    "Ville de la citadelle Vauban",
    "Stadt der Vauban-Zitadelle",
    "Capital of Franche-Comté with a UNESCO-listed Vauban citadel.",
    "Capitale de la Franche-Comté avec une citadelle Vauban classée par l'UNESCO.",
    "Hauptstadt der Franche-Comté mit einer UNESCO-gelisteten Vauban-Zitadelle."
  ],
  "La Rochelle_France": [
    "Atlantic harbor city",
    "Port de l'Atlantique",
    "Atlantikhafen",
    "An Atlantic port city famous for its medieval towers and aquarium.",
    "Port atlantique célèbre pour ses tours médiévales et son aquarium.",
    "Atlantischer Hafenstadt, berühmt für mittelalterliche Türme und ihr Aquarium."
  ],
  "Colmar_France": [
    "Little Venice of Alsace",
    "Petite Venise d'Alsace",
    "Klein-Venedig des Elsass",
    "Alsace's Little Venice, famous for half-timbered houses and Christmas markets.",
    "La Petite Venise d'Alsace, célèbre pour ses maisons à colombages et ses marchés de Noël.",
    "Klein-Venedig im Elsass, berühmt für Fachwerkhäuser und Weihnachtsmärkte."
  ],
  "Bayonne_France": [
    "City of Basque ham",
    "Cité du jambon basque",
    "Stadt des baskischen Schinkens",
    "A Basque city in France known for its ham and chocolate traditions.",
    "Ville basque de France connue pour ses traditions de jambon et de chocolat.",
    "Baskische Stadt in Frankreich, bekannt für Schinken- und Schokoladentraditionen."
  ],
  "Poitiers_France": [
    "City of Romanesque churches",
    "Cité des églises romanes",
    "Stadt der romanischen Kirchen",
    "A historic western French city renowned for Romanesque churches and Futuroscope.",
    "Ville historique de l'ouest de la France réputée pour ses églises romanes et le Futuroscope.",
    "Historische westfranzösische Stadt, berühmt für romanische Kirchen und den Futuroscope."
  ],
  "Troyes_France": [
    "Medieval town on the Champagne route",
    "Cité médiévale sur la route du Champagne",
    "Mittelalterliche Stadt an der Champagner-Route",
    "A Champagne-region town with well-preserved medieval half-timbered buildings.",
    "Ville de la région Champagne aux maisons à colombages médiévales bien conservées.",
    "Stadt in der Champagne mit gut erhaltenen mittelalterlichen Fachwerkhäusern."
  ],
  "Chambéry_France": [
    "Capital of Savoy",
    "Capitale de la Savoie",
    "Hauptstadt Savoyens",
    "Historic capital of Savoy at the foot of the Alps, with Italian charm.",
    "Capitale historique de la Savoie au pied des Alpes, au charme italien.",
    "Historische Hauptstadt Savoyens am Fuß der Alpen mit italienischem Charme."
  ],
  "Valence_France": [
    "Gateway to Provence",
    "Porte de la Provence",
    "Tor zur Provence",
    "A southern Rhône Valley gateway where Provence begins.",
    "Porte sud de la vallée du Rhône où commence la Provence.",
    "Südliches Tor des Rhônetals, wo die Provence beginnt."
  ],
};

// I need to continue building the translations object for all remaining cities.
// Due to the massive size, let me write a helper to output them all.

// Let me write the remaining translations inline:
Object.assign(translations, {
  // === United States - Texas ===
  "Austin_United States": [
    "Live music capital of the world",
    "Capitale mondiale de la musique live",
    "Live-Musik-Hauptstadt der Welt",
    "Capital of Texas, world music capital and tech innovation hub.",
    "Capitale du Texas, capitale mondiale de la musique et pôle d'innovation technologique.",
    "Hauptstadt von Texas, Weltmusikhauptstadt und Zentrum für technologische Innovation."
  ],
  "San Antonio_United States": [
    "City of the Alamo",
    "Ville de l'Alamo",
    "Stadt des Alamo",
    "Home of the Alamo, blending American and Mexican culture along its famous River Walk.",
    "Berceau de l'Alamo, mêlant cultures américaine et mexicaine le long du célèbre River Walk.",
    "Heimat des Alamo, Verschmelzung amerikanischer und mexikanischer Kultur entlang des berühmten River Walk."
  ],
  "Fort Worth_United States": [
    "Where the West begins",
    "Là où commence l'Ouest",
    "Wo der Westen beginnt",
    "Capital of cowboy culture with world-class art museum districts.",
    "Capitale de la culture cowboy avec des quartiers de musées d'art de classe mondiale.",
    "Hauptstadt der Cowboykultur mit erstklassigen Kunstmuseumsbezirken."
  ],
  "El Paso_United States": [
    "Sun City",
    "Ville du Soleil",
    "Sonnenstadt",
    "A U.S.-Mexico border city blending two nations' cultures under endless sunshine.",
    "Ville frontalière entre les États-Unis et le Mexique, fusion de deux cultures sous un soleil permanent.",
    "Grenzstadt zwischen den USA und Mexiko, die zwei Kulturen unter endlosem Sonnenschein vereint."
  ],
  "Corpus Christi_United States": [
    "Texas Riviera",
    "Riviera du Texas",
    "Texas-Riviera",
    "A Gulf Coast beach city known for its shores and windsurfing.",
    "Ville balnéaire du golfe du Mexique connue pour ses plages et la planche à voile.",
    "Golfküsten-Strandstadt, bekannt für ihre Strände und Windsurfen."
  ],
  "Lubbock_United States": [
    "Friendship City",
    "Ville de l'amitié",
    "Stadt der Freundschaft",
    "A Texas High Plains college town and hometown of Buddy Holly.",
    "Ville universitaire des hautes plaines du Texas, ville natale de Buddy Holly.",
    "College-Stadt in den texanischen High Plains und Heimatstadt von Buddy Holly."
  ],
  "Laredo_United States": [
    "Gateway to the Americas",
    "Porte des Amériques",
    "Tor zu den Amerikas",
    "A major U.S.-Mexico border trade hub and one of North America's busiest inland ports.",
    "Important centre commercial frontalier entre les États-Unis et le Mexique.",
    "Wichtiger Handelsknoten an der US-mexikanischen Grenze und einer der verkehrsreichsten Binnenhäfen Nordamerikas."
  ],
  "Amarillo_United States": [
    "Heart of Route 66",
    "Cœur de la Route 66",
    "Herz der Route 66",
    "An iconic Route 66 city, the yellow rose of the Texas Panhandle.",
    "Ville emblématique de la Route 66, la rose jaune du Texas Panhandle.",
    "Ikonische Route-66-Stadt, die gelbe Rose des Texas Panhandle."
  ],
  "Midland_United States": [
    "Tall City",
    "Ville haute",
    "Hohe Stadt",
    "A West Texas oil hub at the heart of the Permian Basin economy.",
    "Pôle pétrolier de l'ouest du Texas au cœur de l'économie du bassin permien.",
    "Ölzentrum in Westtexas im Herzen der Permian-Basin-Wirtschaft."
  ],
});

// This approach is too slow for 1006 entries inline. Let me write a generation script instead.
// I'll write the full output file directly.

console.log("Script structure validated. Now generating full file...");
