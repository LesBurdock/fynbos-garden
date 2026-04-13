// plants-seed.ts
// Seed data for the `plants` table in Supabase.
// Fields match the database schema exactly.
// Run once after your Supabase tables are created in Phase 2.
//
// Usage:
//   const { error } = await supabase.from('plants').insert(PLANTS_SEED);

export type SeasonalTask = {
  month_start: number; // 1–12
  month_end: number;   // 1–12
  task: string;
};

export type PlantSeed = {
  name: string;
  latin_name: string;
  slug: string;
  water_needs: 'Low' | 'Moderate' | 'High';
  sun_tolerance: 'Full sun' | 'Part shade' | 'Full shade';
  wind_hardiness: 'High' | 'Moderate' | 'Low';
  bloom_season: string;
  fynbos_region: string;
  description: string;
  image_url: string;
  seasonal_tasks: SeasonalTask[];
  roof_proven: boolean;
  reference_urls: string[];
};

export const PLANTS_SEED: PlantSeed[] = [
  {
    name: "Savannah Bristle Grass",
    latin_name: "Melinis nerviglumis 'Savannah'",
    slug: "melinis-nerviglumis-savannah",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Karoo, Succulent Karoo, Bushveld, Highveld, Subtropical East Coast, Thicket",
    description: "A compact ornamental grass reaching 50cm with red-purple flowers in spring and summer. Thrives in disturbed and sandy soils with no fertiliser required — ideal for lightweight roof substrates. Excellent for topsoil stabilisation on exposed surfaces. Suited to full sun and windy positions. Prefers no fertiliser at any time of year.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 7,
        month_end: 8,
        task: "Cut back hard to base after flowering — do not fertilise"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/melinis-savannah-melinis-nerviglumis",
      "https://www.theplantlibrary.co.za/plants/melinis-species",
    ],
  },

  {
    name: "Red Grass",
    latin_name: "Themeda triandra",
    slug: "themeda-triandra",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Karoo, Thicket, Bushveld Savanna, Subtropical East Coast",
    description: "A tough iconic South African grass known as Rooigras, growing 40cm–1.2m depending on conditions. Cream flowers from October through July. Handles full sun, wind exposure, rocky and sandy soils, and dry conditions — well suited to roof zones with high wind and minimal substrate depth. Good for grassland meadow and rockery situations. Attracts birds.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 7,
        task: "Cut back to 10cm in winter to encourage fresh growth in spring"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/andropogon-eucomus",
    ],
  },

  {
    name: "Tortoise Berry",
    latin_name: "Muraltia spinosa",
    slug: "muraltia-spinosa",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Western Cape, Karoo, Thicket",
    description: "A small spiny fynbos shrub reaching 1m x 1m with pink-purple flowers from April to October. Frost tender — needs shelter from cold in exposed positions. Suited to hot dry conditions in full sun. Winter rainfall adapted. Good for rockery and shrubbery situations. Attracts birds and tortoises.",
    image_url: "https://www.theplantlibrary.co.za/plants/muraltia-spinosa",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Light tip prune after main flowering flush to maintain compact shape"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/muraltia-spinosa",
    ],
  },

  {
    name: "Spike Spurflower",
    latin_name: "Plectranthus spicatus",
    slug: "plectranthus-spicatus",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Thicket, Bushveld Savanna, Subtropical East Coast, Highveld",
    description: "Also known as Lavender Plectranthus. A succulent perennial with 70cm lavender blue-mauve flower spikes from March to June — filling the autumn-winter gap when many other plants are dormant. Hardy and low water. Explicitly listed as suitable for roof gardens, walls and rocky slopes. Attracts butterflies, bees and insects. Summer rainfall adapted.",
    image_url: "https://www.theplantlibrary.co.za/plants/plectranthus-spicatus",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 8,
        task: "Prune hard after winter flowering to encourage healthy growth and flowers the following season"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/plectranthus-spicatus",
    ],
  },

  {
    name: "Cape Scabious",
    latin_name: "Scabiosa africana / incisa / columbaria hybrids",
    slug: "scabiosa-cape-scabious",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Highveld, Thicket, Subtropical East Coast",
    description: "Also called Pincushion — not to be confused with Leucospermum. A perennial reaching 60cm with mauve, pink, purple or white flowers from September to December. Explicitly listed as suitable for containers and roof gardens. Hardy and winter-rainfall adapted. Tolerates clay soils. Attracts insects and butterflies.",
    image_url: "https://www.theplantlibrary.co.za/plants/scabiosa-africana-incisa-columbaria-hybrids",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Deadhead spent flowers after summer flush to encourage repeat blooming"
      },
      {
        month_start: 6,
        month_end: 7,
        task: "Light trim in winter dormancy to tidy shape — do not cut back hard"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/pincushion-flower-small-scabious-dove-pincushions-scabiosa-columbaria",
      "https://www.theplantlibrary.co.za/plants/scabiosa-africana-incisa-columbaria-hybrids",
    ],
  },

  {
    name: "Blue Marguerite",
    latin_name: "Felicia amelloides",
    slug: "felicia-amelloides",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Thicket",
    description: "A low-growing groundcover reaching 60cm x 60cm with blue or white daisy flowers from September through March. One of the most roof-garden-friendly plants in the list — explicitly cited for roof gardens, containers, walls, sandy soils, paving and narrow spaces. Hardy and low water. Tolerates clay soils. Attracts bees, butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/felicia-amelloides-",
    seasonal_tasks: [
      {
        month_start: 4,
        month_end: 5,
        task: "Cut back by one third after main flowering flush to maintain compact shape and encourage fresh growth"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/felicia-amelloides-",
      "https://mygardenlife.com/plant-library/blue-marguerite-felicia-amelloides",
    ],
  },

  {
    name: "Wild Cineraria",
    latin_name: "Cineraria saxifraga",
    slug: "cineraria-saxifraga",
    water_needs: "Low",
    sun_tolerance: "Part shade",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Thicket, Coastal Eastern Cape, Coastal KZN",
    description: "A compact perennial growing 15–40cm with yellow flowers in spring and summer. One of the few plants in this list that tolerates semi-shade — ideal for part-shade roof zones. Explicitly listed for roof gardens, green walls, containers, dry shade and narrow spaces. Grows naturally on rocky cliff faces. Summer rainfall adapted.",
    image_url: "https://www.theplantlibrary.co.za/plants/cineraria-saxifraga",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Remove spent flower stems after summer flowering to keep tidy"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/cineraria-saxifraga",
    ],
  },

  {
    name: "Trailing Mauve Daisy",
    latin_name: "Dimorphotheca jucunda",
    slug: "dimorphotheca-jucunda",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Thicket, Highveld, Bushveld Savanna, Subtropical East Coast",
    description: "A trailing groundcover perennial, 25–35cm tall and 60cm wide with mauve daisy flowers from March to September — covering the autumn-winter-spring gap when many fynbos plants rest. Explicitly listed for roof gardens, hanging baskets, walls and containers. Handles sandy, dry and clay soils. Summer rainfall adapted. Attracts butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/dimorphotheca-jucunda",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Trim back after spring flush — this groundcover can sprawl; cut before summer to keep compact"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://mygardenlife.com/plant-library/osteospermum-african-daisy-cape-daisy-osteospermum-hybrid",
      "https://www.theplantlibrary.co.za/plants/dimorphotheca-jucunda",
    ],
  },

  {
    name: "Carpet Geranium",
    latin_name: "Geranium incanum",
    slug: "geranium-incanum",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Thicket, Coastal Eastern Cape, Coastal KZN",
    description: "Also known as Bergtee or Cranebill. A spreading groundcover perennial, 35cm x 50cm with mauve flowers from September through May. Explicitly listed for roof gardens, containers, walls, green walls and paving. Handles windy exposed positions well — one of the stronger groundcovers for full-sun exposed roof zones. Winter and summer rainfall adapted. Attracts bees, butterflies and insects.",
    image_url: "https://www.theplantlibrary.co.za/plants/geranium-incanum",
    seasonal_tasks: [
      {
        month_start: 6,
        month_end: 7,
        task: "Cut back by half in winter after flowering ends — encourages dense regrowth for the spring flush"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/geranium-incanum",
    ],
  },

  {
    name: "Cape Thatching Reed",
    latin_name: "Chondropetalum tectorum",
    slug: "chondropetalum-tectorum",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn",
    fynbos_region: "Western Cape, Coastal Eastern Cape",
    description: "Also known as Cape Rush or Dakriet. A restio forming dense tufted clumps of dark green jointed stems reaching 60–90cm, topped with small brown flowers in autumn. Historically used as thatching material — ideally suited to roof conditions. Handles coastal winds, sandy soils and drought once established. Evergreen with year-round architectural structure. Tolerates both dry and occasionally moist conditions. Does not require fertiliser. Trim old brown stems at the base as needed — do not prune back stems that are still green as they will not reshoot.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 9,
        month_end: 10,
        task: "Remove outer layer of brown and decaying culms — do not cut back green stems"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/elegia-tectorum",
      "https://www.thegardener.co.za/the-gardener/cc/chondropetalum-tectorum/",
    ],
  },

  {
    name: "Cape Honeysuckle",
    latin_name: "Tecoma capensis",
    slug: "tecoma-capensis",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Year-round (peak Autumn–Spring)",
    fynbos_region: "Western Cape, Coastal Eastern Cape, KwaZulu-Natal",
    description: "A fast-growing, evergreen scrambling shrub reaching 2–3m with clusters of tubular orange, red or yellow flowers almost year-round. Wind tolerant, heat tolerant, salt spray tolerant — well suited to exposed Cape Town rooftops. Needs pruning to contain size in a container. Blooms on new wood so prune in late winter before new growth. Attracts sunbirds and butterflies. Frost tender when young. Available in several cultivars — 'Lutea' (yellow, compact ~1x1m) is the best choice for containers as it stays manageable without heavy pruning.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 7,
        month_end: 8,
        task: "Prune back by one third in late winter before new growth — blooms on new wood so timing is critical"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/tecomaria-capensis",
      "https://www.thegardener.co.za/the-gardener/aa/tecoma-capensis-apricot/",
    ],
  },

  {
    name: "False Olive",
    latin_name: "Buddleja saligna",
    slug: "buddleja-saligna",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Coastal Eastern Cape, Grassland, Bushveld, Fynbos",
    description: "A fast-growing, evergreen shrub or small tree with narrow grey-green leaves and dense sprays of tiny honey-scented cream-white flowers from August to January. Remarkably drought-resistant and handles windy, coastal and clay soil conditions. Can be pruned hard to maintain as a dense shrub or windbreak. Grows up to 800mm per year. Non-aggressive root system — suitable for containers with pruning. Attracts bees, butterflies and insects in large numbers. Also known as witolienhout.",
    image_url: "https://www.theplantlibrary.co.za/plants/buddleja-saligna-",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Cut back after summer flowering to keep tidy and maintain compact shape — responds well to hard pruning"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/buddleja-saligna",
      "https://www.theplantlibrary.co.za/plants/buddleja-saligna-",
    ],
  },

  {
    name: "Sagewood",
    latin_name: "Buddleja salviifolia",
    slug: "buddleja-salviifolia",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Grassland, Fynbos, Nama-Karoo, Savanna",
    description: "A large, dense, aromatic shrub with sage-like leaves and clusters of honey-scented lilac to white flowers in winter and spring. Useful as a framework or background plant and makes an excellent hedge when pruned regularly. Occurs along watercourses and forest margins. Needs well-drained soil and shelter from cold winds. Attracts bees, butterflies and birds. Fresh and dried leaves make an aromatic herbal tea. Needs shelter from cold drying winds — best in a more protected zone.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Prune after spring flowering to maintain compact shape and encourage dense regrowth"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/buddleja-salviifolia",
    ],
  },

  {
    name: "Hopbush",
    latin_name: "Dodonaea viscosa var. angustifolia",
    slug: "dodonaea-viscosa",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Western Cape, Namaqualand, Coastal Eastern Cape, KwaZulu-Natal, Karoo",
    description: "A fast-growing, evergreen shrub with shiny green drooping leaves and decorative clusters of yellow or reddish papery-winged fruits from April to August. Extremely wind tolerant and widely used as a windbreak and hedge. Tolerates arid conditions, sandy soils, coastal salt spray and a wide range of soils. Frost hardy. Compact 'Purpurea' cultivar has striking purple foliage. Excellent pioneer plant — one of the best choices for the most exposed wind-hit zones. Does not need much water once established.",
    image_url: "https://www.theplantlibrary.co.za/plants/andropogon-eucomus",
    seasonal_tasks: [
      {
        month_start: 8,
        month_end: 9,
        task: "Light pruning after fruiting to maintain shape and control size in containers"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/dodonaea-viscosa-var-angustifolia",
    ],
  },

  {
    name: "Camphor Bush",
    latin_name: "Tarchonanthus camphoratus",
    slug: "tarchonanthus-camphoratus",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Summer (Dec–May)",
    fynbos_region: "Western Cape, Karoo, Bushveld, Coastal areas",
    description: "Also known as Wildekanferbos. A silvery-grey evergreen shrub or small tree with aromatic camphor-scented leaves and fluffy cream-white flower heads followed by cotton-wool-like seed heads. One of the toughest plants available — tolerates extreme wind, coastal conditions, impoverished soils, drought and frost. Excellent for windbreaks and screening. Note: the coastal form (T. littoralis) is the correct species for Cape Town coastal gardens — what is sold as T. camphoratus in Western Cape nurseries is typically this coastal form. Grows at a moderate rate of 600–800mm per year.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 9,
        month_end: 10,
        task: "Prune after flowering to control size and maintain shape — responds well to clipping and hard pruning"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://habitattreenursery.co.za/tree/tarchonanthus-camphoratus-camphor-bush/",
      "https://pza.sanbi.org/tarchonanthus-littoralis",
    ],
  },

  {
    name: "Honey Bush",
    latin_name: "Melianthus major",
    slug: "melianthus-major",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "Low",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Cedarberg, Cederberg",
    description: "A dramatic foliage plant with large, deeply serrated blue-grey pinnate leaves up to 45cm long and tall spikes of honey-scented burgundy-maroon flowers in spring and summer. RHS Award of Garden Merit winner. Grows 1.5–3m tall in good conditions. Excellent in large containers as a specimen or focal point. Needs shelter from strong drying winds as the large leaves can be damaged. Drought tolerant once established. Attracts sunbirds. Foliage is toxic — keep away from children and pets. Best suited to Zone B or D where wind is moderated.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 8,
        month_end: 9,
        task: "Cut stems back hard in late winter/early spring to encourage fresh vigorous growth and maintain compact form"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://hort.extension.wisc.edu/articles/honeybush-melianthus-major/",
    ],
  },

  {
    name: "Bietou",
    latin_name: "Chrysanthemoides monilifera subsp. monilifera",
    slug: "chrysanthemoides-monilifera",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Western Cape, Coastal Eastern Cape, Strandveld, Fynbos",
    description: "Also known as Tick Berry or Bosluisbessie. A fast-growing semi-succulent spreading shrub to 2m with bright yellow daisy flowers in autumn and winter followed by edible black berries. Thrives in strandveld, fynbos and seafront conditions. Requires full sun and well-drained position. One of the best plants for difficult coastal conditions — handles wind, sandy soils and salt spray. Excellent pioneer and screening plant. Note: the subsp. monilifera (Western Cape form) is the correct garden plant — it is not the invasive subsp. rotundata that is a weed in Australia. Attracts birds.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 9,
        month_end: 10,
        task: "Prune after winter flowering to control size and encourage dense new growth — can be clipped into a hedge"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/osteospermum-moniliferum",
    ],
  },

  {
    name: "Mountain Anise Buchu",
    latin_name: "Agathosma ciliaris",
    slug: "agathosma-ciliaris",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Western Cape, Cape Peninsula",
    description: "A hardy, aromatic, densely rounded fynbos shrublet to 45cm with fine leaves releasing an aniseed-like fragrance when crushed. White or mauve flowers in terminal clusters from May to December. Handles salt spray, wind and coastal conditions — described as coastal-tough. Ideal for small spaces and containers. One of 150 buchu species, mostly confined to the Western Cape. Plant in well-draining sandy soil in full sun. Water moderately in summer, generously in winter. Slow-growing — do not plant near faster-growing species.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 12,
        month_end: 1,
        task: "Light prune after spring flowering flush to maintain compact rounded shape"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/agathosma-ciliaris",
      "https://www.capegardencentre.co.za/products/berg-buchu-agathosma-ciliaris",
    ],
  },

  {
    name: "Garlic Buchu",
    latin_name: "Agathosma apiculata",
    slug: "agathosma-apiculata",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Autumn–Spring",
    fynbos_region: "Western Cape, Coastal Eastern Cape",
    description: "A medium to large aromatic fynbos shrub, 30cm–1.5m, with small dark green leaves releasing a distinctive garlic scent when crushed due to volatile oils. White flowers at stem tips from April to January. Suitable for coastal gardens and fynbos gardens. Requires full sun, well-drained soil, alkaline to acid. Good as a filler or accent in a mixed fynbos planting. Slow-growing — give it space and do not crowd with faster plants. Water well in winter, moderately in summer. Pinch back young plants to encourage bushy growth.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Light tip prune after the main flowering flush to maintain bushy shape"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/agathosma-apiculata",
    ],
  },

  {
    name: "Blue Sceptre",
    latin_name: "Aristea capitata",
    slug: "aristea-capitata",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Cape Peninsula, Piketberg to George",
    description: "Also known as Blousuurkanol. A striking evergreen rhizomatous perennial forming thick clumps of upright sword-shaped leaves to 1.5m, with tall spikes of vivid indigo-blue flowers from October to December. One of the most distinctive sights on Lion's Head and Cape mountain slopes in early summer. Individual flowers last less than a day but a succession opens over weeks. Needs full sun, well-drained acid loamy soil — not too dry and sandy. Good water in winter and spring. Drought tolerant once established and prefers dry conditions in summer. Can be container grown. Leaves susceptible to rust without enough sun.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 12,
        month_end: 1,
        task: "Cut faded flower spikes to the base after flowering — leave attractive brown seed capsules if desired for dried arrangements"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/aristea-capitata",
      "https://www.thegardener.co.za/the-gardener/aa/aristea-capitata/",
    ],
  },

  {
    name: "Fragrant Bugle Lily",
    latin_name: "Watsonia marginata",
    slug: "watsonia-marginata",
    water_needs: "Moderate",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Summer",
    fynbos_region: "Western Cape, Fynbos",
    description: "A tall, elegant deciduous perennial growing from corms with erect fans of sword-shaped leaves and spikes of fragrant pink to pale purple flowers in spring and early summer. Grows 1–2m in flower. Winter-growing, summer-dormant — corms rest dry over the hottest months. Thrives in full sun with well-drained composted soil and plenty of winter rainfall. Easy to grow and requires minimal care. Can be grown in large containers. Faintly fragrant flowers. Dies back after flowering — pair with evergreen companions to fill the gap.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 3,
        task: "Allow foliage to die back naturally after flowering — corms rest dormant in summer, keep dry"
      },
      {
        month_start: 3,
        month_end: 4,
        task: "Plant or repot corms in autumn at start of the growing season"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://en.wikipedia.org/wiki/Watsonia_marginata",
    ],
  },

  {
    name: "Society Garlic",
    latin_name: "Tulbaghia violacea",
    slug: "tulbaghia-violacea",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Summer–Autumn",
    fynbos_region: "Eastern Cape, KwaZulu-Natal, Limpopo",
    description: "A compact, clump-forming evergreen perennial to 50cm with narrow grey-green strap leaves and umbels of sweetly fragrant lilac-pink star-shaped flowers from January to April (and almost year-round in warm conditions). Both flowers and leaves edible with mild garlic flavour. Explicitly recommended for rooftop gardens, balconies and containers. Salt tolerant, drought tolerant, heat tolerant. The airy flower stems sway beautifully in wind — one of the few plants that looks better in a breeze. Leaves smell of garlic when crushed — repels fleas, ticks and mosquitoes. Slow to spread by rhizomes, not invasive.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 8,
        month_end: 9,
        task: "Divide congested clumps in early spring every 2–3 years to rejuvenate and encourage better flowering"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://pza.sanbi.org/tulbaghia-violacea",
      "https://www.gardenia.net/plant/tulbaghia-violacea-society-garlic",
    ],
  },

  {
    name: "Leucadendron Safari Sunset",
    latin_name: "Leucadendron 'Safari Sunset'",
    slug: "leucadendron-safari-sunset",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Western Cape, Fynbos",
    description: "A popular leucadendron hybrid with deep burgundy-red bracts and upright growth to about 1.5m. One of the most widely grown leucadendrons for cut flower and garden use. Good drought tolerance once established. Full sun, well-drained soil, no phosphorus fertiliser. Pairs well with Leucospermum Ayoba Pink and Calypso Red. Prune after flowering to maintain shape and encourage bushy growth.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 9,
        month_end: 10,
        task: "Prune after flowering — cut back by one third to maintain shape and encourage bushy new growth"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Leucadendron Burgundy Sunset",
    latin_name: "Leucadendron 'Burgundy Sunset'",
    slug: "leucadendron-burgundy-sunset",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Autumn–Winter",
    fynbos_region: "Western Cape, Fynbos",
    description: "A leucadendron hybrid with rich burgundy and copper-toned bracts, similar in character to Safari Sunset but with warmer tones. Upright growth to about 1.5m. Full sun, well-drained, low phosphorus soil. No fertiliser with phosphorus — highly toxic to proteas and leucadendrons. Good companion to Leucospermum Ayoba Red and Calypso Red. Prune after flowering.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 9,
        month_end: 10,
        task: "Prune after flowering — cut back by one third to maintain shape and encourage bushy new growth"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Erica abietina",
    latin_name: "Erica abietina",
    slug: "erica-abietina",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A fine-leaved fynbos erica with small tubular flowers in winter and spring. Typical fynbos conditions apply — full sun, well-drained acid sandy soil, no phosphorus fertiliser. Part of the classic fynbos palette alongside leucadendrons and leucospermums. Sensitive to overwatering and fertiliser — less is more. Good in containers with a perlite-heavy substrate.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Light tip prune after flowering to encourage compact bushy growth"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Erica sparmanii",
    latin_name: "Erica sparmanii",
    slug: "erica-sparmanii",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A fynbos erica suited to full sun and well-drained sandy acid soil. Winter-spring flowering. Classic companion to leucadendrons and leucospermums in the fynbos garden palette. Sensitive to phosphorus — use only phosphorus-free fertiliser. Good in containers with a lean, well-draining fynbos substrate mix.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 10,
        month_end: 11,
        task: "Light tip prune after flowering to maintain compact shape"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Leucospermum Ayoba Pink",
    latin_name: "Leucospermum 'Ayoba Pink'",
    slug: "leucospermum-ayoba-pink",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A compact leucospermum (pincushion) cultivar with soft pink pincushion flowers, bred specifically for container growing and smaller spaces. One of the Ayoba series developed for the garden market. Full sun, well-drained soil, no phosphorus fertiliser. Good companion to Leucadendron Safari Sunset and Burgundy Sunset. Excellent for roof gardens — manageable size, showy flowers, drought tolerant.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 11,
        month_end: 12,
        task: "Light prune after flowering to maintain shape — remove spent flower heads"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Leucospermum Calypso Red",
    latin_name: "Leucospermum 'Calypso Red'",
    slug: "leucospermum-calypso-red",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A compact leucospermum cultivar with vivid red pincushion flowers. Part of the container-friendly cultivar range alongside Ayoba Red, Ayoba Pink, Sweet Lucy and Senorita. Full sun, excellent drainage, no phosphorus fertiliser ever. Drought tolerant once established. Bold colour contrast against the silver-grey of Tarchonanthus or the blue-green of Melianthus. One of the showiest rooftop fynbos options.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 11,
        month_end: 12,
        task: "Light prune after flowering — remove spent heads and tip prune to encourage bushy shape"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Leucospermum Ayoba Red",
    latin_name: "Leucospermum 'Ayoba Red'",
    slug: "leucospermum-ayoba-red",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A compact leucospermum cultivar with deep red pincushion flowers, part of the Ayoba series bred for container growing. Full sun, well-drained low-phosphorus substrate. No phosphorus fertiliser. Excellent companion to Leucadendron Burgundy Sunset. Suited to the feature zone where it can be the centrepiece of a bold South African colour scheme.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 11,
        month_end: 12,
        task: "Light prune after flowering — remove spent heads and tip prune to encourage bushy shape"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Leucospermum Sweet Lucy",
    latin_name: "Leucospermum 'Sweet Lucy'",
    slug: "leucospermum-sweet-lucy",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "High",
    bloom_season: "Winter–Spring",
    fynbos_region: "Western Cape, Fynbos",
    description: "A leucospermum cultivar notable for its sweet fragrance — unusual in the genus. Cream to pale yellow pincushion flowers with a pleasant scent. Compact enough for containers. Full sun, well-drained low-phosphorus substrate. No phosphorus fertiliser. One of the scented plants recommended for the garden alongside Agathosma and Tulbaghia.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 11,
        month_end: 12,
        task: "Light prune after flowering — remove spent heads and tip prune to encourage bushy shape"
      }
    ],
    roof_proven: false,
    reference_urls: [],
  },

  {
    name: "Scabiosa africana",
    latin_name: "Scabiosa africana",
    slug: "scabiosa-africana",
    water_needs: "Low",
    sun_tolerance: "Full sun",
    wind_hardiness: "Moderate",
    bloom_season: "Spring–Autumn",
    fynbos_region: "Western Cape, Fynbos, Coastal Eastern Cape",
    description: "The true Cape Scabious — a perennial with lavender-mauve pincushion flowers over a long season. Grows in sandy, well-drained fynbos soils in full sun. Different from the hybrid Scabiosa columbaria — this is the larger-growing Cape species reaching 60–80cm. Long blooming from spring through autumn. Low water once established. Attracts bees, butterflies and insects. Good cut flower. Winter rainfall adapted.",
    image_url: "",
    seasonal_tasks: [
      {
        month_start: 1,
        month_end: 2,
        task: "Deadhead spent flowers to encourage continued blooming through summer"
      },
      {
        month_start: 6,
        month_end: 7,
        task: "Light tidy-up in winter — do not cut back hard"
      }
    ],
    roof_proven: false,
    reference_urls: [
      "https://www.theplantlibrary.co.za/plants/scabiosa-africana-incisa-columbaria-hybrids",
    ],
  },
];

// ─── SEEDING NOTES ───────────────────────────────────────────────────────────
//
// 1. image_url — Red Grass and Savannah Bristle Grass are missing image URLs.
//    Upload your own photos to Supabase Storage and replace the empty strings.
//    Avoid hotlinking from theplantlibrary.co.za as those URLs may break.
//
// 2. Slugs are the URL identifier for each plant. Confirm latin name spelling
//    before inserting — typos will affect the find-replacement matching logic.
//
// 3. wind_hardiness logic:
//    "High"     = explicitly listed as handling windy/exposed positions
//    "Moderate" = general sun plant, no specific wind note
//    "Low"      = noted as tender or needing shelter
//
// 4. reference_urls is a jsonb column in Supabase — the string[] type here
//    maps correctly to a Postgres jsonb array on insert.
//
// ─────────────────────────────────────────────────────────────────────────────

// Supabase insert example:
//
// import { createClient } from '@supabase/supabase-js';
// import { PLANTS_SEED } from './plants-seed';
//
// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );
//
// async function seed() {
//   const { error } = await supabase.from('plants').insert(PLANTS_SEED);
//   if (error) console.error(error);
//   else console.log(`Seeded ${PLANTS_SEED.length} plants`); // 31 plants
// }
//
// seed();
