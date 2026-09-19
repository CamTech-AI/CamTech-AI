(function(){

  /* =====================================================================
   * DATA: cameras, lenses, gear, shooting types
   * =================================================================== */

  var CAMERAS = {
    "Sony": ["Alpha 1 II","Alpha 9 III","Alpha 7R V","Alpha 7S III","Alpha 7 IV","Alpha 7C II","Alpha 6700","FX3 Cinema Line","FX30 Cinema Line","ZV-E10 II"],
    "Canon": ["EOS R1","EOS R5 Mark II","EOS R6 Mark II","EOS R3","EOS R8","EOS R7","EOS R10","EOS R50","EOS 5D Mark IV","PowerShot G7 X Mark III"],
    "Nikon": ["Z9","Z8","Z6 III","Z5 II","Zf","Z50 II","Z30","D850"],
    "Fujifilm": ["GFX100 II","X-H2","X-H2S","X-T5","X-T50","X-S20","X100VI"],
    "Panasonic (Lumix)": ["S1R II","S1H","S5 IIX","GH6","G9 II"],
    "OM System": ["OM-1 II","OM-3","OM-5 II","E-M1 III"],
    "Leica": ["SL3-S","Q3","M11"],
    "Hasselblad": ["X2D 100C","907X"],
    "Pentax": ["K-1 II","K-3 III","645Z"],
    "Ricoh": ["GR III","GR IIIx"],
    "Sigma": ["BF","fp L"],
    "Blackmagic Design": ["Pocket Cinema Camera 6K Pro","Pocket Cinema Camera 6K G2","URSA Mini Pro 12K"],
    "GoPro": ["HERO13 Black","HERO12 Black","HERO11 Black Mini","MAX"],
    "DJI": ["Osmo Pocket 3","Osmo Action 5 Pro","Ronin 4D","Mavic 3 Pro (drone)","Mini 4 Pro (drone)"],
    "Apple": ["iPhone 18 Pro Max","iPhone 18 Pro","iPhone 17 Pro Max","iPhone 17 Pro","iPhone 17e","iPhone 16 Pro Max"],
    "Samsung": ["Galaxy S26 Ultra","Galaxy S26+","Galaxy S26","Galaxy S26 FE","Galaxy S25 Ultra"],
    "Google": ["Pixel 11 Pro XL","Pixel 11 Pro","Pixel 11","Pixel 10 Pro"],
    "OnePlus": ["OnePlus 13","OnePlus 13R","OnePlus Open"],
    "Xiaomi": ["Xiaomi 14 Ultra","Xiaomi 14"],
    "Oppo": ["Find X8 Pro"],
    "Vivo": ["X200 Pro"],
    "Motorola": ["Edge Plus","Razr Plus"],
    "Other": []
  };

  var LENSES = ["Kit zoom (18-55mm)","Wide-angle (10-24mm)","Standard zoom (24-70mm)","Telephoto zoom (70-200mm)","Super telephoto (150-600mm)","50mm prime","85mm prime","Macro lens","Fisheye lens","Cinema prime","Built-in phone lens"];

  var GEAR = ["Tripod","Gimbal / stabilizer","ND filters","Polarizer (CPL)","External flash","LED light","Reflector","Lavalier mic","Drone","Slider / dolly"];

  var STYLES = {
    photo: ["Portrait","Landscape","Macro / close-up","Astrophotography","Sports / action","Street / candid","Wildlife","Product / studio","Long exposure","Night / low light"],
    video: ["Cinematic","Slow motion","Timelapse","Hyperlapse","Vlog / talking head","Action / sports","Low light / night","Interview","Aerial / drone","Music video / B-roll"]
  };

  /* =====================================================================
   * DATA: per-style baseline settings (standard exposure-triangle rules
   * of thumb, computed locally -- not a light-meter reading of your
   * actual scene).
   * =================================================================== */

  var PHOTO_DATA = {
    "Portrait": { aperture:"f/1.8 \u2013 f/2.8", shutter:"1/125s or faster", iso:"100\u2013400 outdoors, 400\u20131600 indoors", wb:"Auto, or Shade for warmer skin tones", focus:"Single-shot AF on the near eye", note:"Meter for the face, not the background.", idealLens:["85mm prime","50mm prime","Standard zoom (24-70mm)"], wantsTripod:false, wantsND:false, tips:["Focus on the eye closest to the camera \u2014 everything else reads off that.","Open the aperture as wide as your lens allows for background separation.","Watch the edges of the frame for clutter or bright spots that pull attention."], summary:"Keep the aperture wide, lock focus on the eye, and let the background fall away." },
    "Landscape": { aperture:"f/8 \u2013 f/11", shutter:"1/125s handheld, or several seconds on a tripod", iso:"100 (base ISO)", wb:"Daylight, or Auto", focus:"Manual, focused about a third into the scene", note:"Use a 2-second timer or remote release so you're not touching the camera at the moment of exposure.", idealLens:["Wide-angle (10-24mm)","Kit zoom (18-55mm)"], wantsTripod:true, wantsND:true, tips:["Shoot during golden hour for softer light and longer shadows.","f/8\u2013f/11 is the sharpest range on most lenses \u2014 don't go narrower than you need.","A polarizer cuts glare and deepens skies if the sun's off to one side."], summary:"Stop down for depth, steady the camera, and let the light do the rest." },
    "Macro / close-up": { aperture:"f/8 \u2013 f/16", shutter:"1/200s+ handheld, slower on a tripod or with flash", iso:"200\u2013800", wb:"Auto", focus:"Manual focus \u2014 autofocus hunts at macro distances", note:"Depth of field is razor-thin up close; a small aperture buys a little more of it.", idealLens:["Macro lens","Telephoto zoom (70-200mm)"], wantsTripod:true, wantsND:false, tips:["Focus by rocking slightly forward and back once you're close, rather than turning the ring.","A diffused flash or reflector fills the shadow you'll otherwise cast on the subject.","Even small vibrations show at this magnification \u2014 a tripod or fast shutter helps."], summary:"Stop down for depth, focus manually, and control your light source carefully." },
    "Astrophotography": { aperture:"As wide as your lens goes (f/1.4 \u2013 f/2.8)", shutter:"10\u201325s (roughly 500 \u00f7 focal length, before stars trail)", iso:"1600\u20136400", wb:"3200\u20134000K, or Auto", focus:"Manual focus to infinity, checked by zooming in on a bright star in live view", note:"Turn off image stabilization once the camera's on a tripod \u2014 it can introduce blur on a static shot.", idealLens:["Wide-angle (10-24mm)"], wantsTripod:true, wantsND:false, tips:["Shoot RAW \u2014 you'll want the latitude to pull shadows in post.","Get away from light pollution if you can; it matters more than any setting here.","A 2-second timer or remote release avoids shake from pressing the shutter."], summary:"Widest aperture, longest shutter before trailing, and manual focus locked to infinity." },
    "Sports / action": { aperture:"f/2.8 \u2013 f/5.6", shutter:"1/1000s or faster", iso:"Auto (400\u20133200 depending on light)", wb:"Auto", focus:"Continuous AF (AF-C) with subject tracking, burst drive mode", note:"Switch the drive mode to high-speed burst so you're not relying on a single click's timing.", idealLens:["Telephoto zoom (70-200mm)","Super telephoto (150-600mm)"], wantsTripod:false, wantsND:false, tips:["Pre-focus on where the action will happen and let tracking take over from there.","Shoot in bursts through the peak of the action rather than single frames.","A monopod saves your arms on a long lens without losing much stability."], summary:"Fast shutter, continuous tracking, and burst mode to catch the peak of the action." },
    "Street / candid": { aperture:"f/5.6 \u2013 f/8", shutter:"1/250s or faster", iso:"Auto (100\u20131600)", wb:"Auto", focus:"Zone focus, or wide-area AF-C", note:"Pre-set your exposure so the camera's ready the instant something happens.", idealLens:["Wide-angle (10-24mm)","Standard zoom (24-70mm)"], wantsTripod:false, wantsND:false, tips:["Zone-focus at a set distance so you can shoot without waiting on autofocus.","Look for the light and the background first, then wait for a subject to walk into it.","Keep settings simple enough that you can react in a second or two."], summary:"Stay ready with zone focus and a fast-enough shutter so you never miss the moment." },
    "Wildlife": { aperture:"As wide as your telephoto allows (f/4 \u2013 f/6.3)", shutter:"1/1000\u20131/2000s", iso:"Auto, raised as needed for shade or foliage", wb:"Auto", focus:"AF-C with animal-eye tracking if your camera has it", note:"A bean bag or monopod steadies a long lens far better than hand-holding alone.", idealLens:["Super telephoto (150-600mm)","Telephoto zoom (70-200mm)"], wantsTripod:true, wantsND:false, tips:["Shoot in bursts \u2014 animal behavior turns in a fraction of a second.","Focus on the eye; a sharp eye forgives a lot elsewhere in the frame.","Patience and knowing the animal's habits beats chasing it every time."], summary:"Fast shutter, tracking autofocus, and the patience to wait for the moment." },
    "Product / studio": { aperture:"f/8 \u2013 f/11", shutter:"1/125s (typical flash sync)", iso:"100 (base ISO)", wb:"Match your lights \u2014 use a custom white balance if you can", focus:"Manual focus, or single-AF with focus peaking", note:"A grey card or color checker keeps color consistent across a whole shoot.", idealLens:["Macro lens","50mm prime","Standard zoom (24-70mm)"], wantsTripod:true, wantsND:false, tips:["Diffuse your light source \u2014 direct light on glossy products creates hot reflections.","Lock the camera on a tripod so composition stays identical across a whole set.","Shoot a grey card once under your lighting to nail white balance in post."], summary:"Controlled light, a locked-off tripod, and a small aperture for edge-to-edge sharpness." },
    "Long exposure": { aperture:"f/8 \u2013 f/16", shutter:"Several seconds to a few minutes, depending on the effect", iso:"100 (base ISO)", wb:"Daylight, or Auto", focus:"Manual \u2014 focus before attaching a dark ND filter, autofocus won't see through it", note:"A strong ND filter is what lets you shoot long exposures in daylight at all.", idealLens:["Wide-angle (10-24mm)"], wantsTripod:true, wantsND:true, tips:["Cover the viewfinder eyepiece \u2014 light can leak in during a long exposure.","Start around 1\u20134 seconds for silky water, 30s+ for streaking clouds.","Use a remote release or the camera's timer so you're not touching it mid-exposure."], summary:"Lock it down, filter the light, and let the shutter stay open for the effect you're after." },
    "Night / low light": { aperture:"As wide as your lens allows (f/1.4 \u2013 f/2.8)", shutter:"1/30\u20131/60s handheld, longer on a tripod", iso:"1600\u20136400", wb:"Auto, or Tungsten under artificial light", focus:"Single AF with an assist light, or manual", note:"A little extra ISO usually looks better than a blurry shot from too slow a shutter.", idealLens:["50mm prime","85mm prime"], wantsTripod:true, wantsND:false, tips:["Brace against something solid if you don't have a tripod on you.","Shoot RAW \u2014 it gives you real room to clean up noise afterward.","Don't be afraid of ISO \u2014 a sharp, grainy shot beats a smooth, blurry one."], summary:"Open the aperture, accept some ISO, and stabilize however you can." }
  };

  var VIDEO_DATA = {
    "Cinematic": { aperture:"f/2.8 \u2013 f/4", shutter:"1/50s (180-degree rule at 24fps)", iso:"Base ISO of your camera (usually 100\u2013800)", fps:"24fps", wb:"Match the scene \u2014 5600K daylight or 3200K tungsten", focus:"Manual focus, or smooth AF-C", note:"Use ND filters to hold that shutter speed in bright daylight instead of stopping the aperture down.", idealLens:["Cinema prime","Standard zoom (24-70mm)"], wantsTripod:false, wantsND:true, wantsMic:false, tips:["The 180-degree rule (shutter \u2248 double your frame rate) is what gives motion its natural blur.","Keep white balance locked across a scene so cuts don't shift in color.","A gimbal or slider adds production value even to simple moves."], summary:"Hold the 180-degree rule, lock your white balance, and let the movement stay deliberate." },
    "Slow motion": { aperture:"f/4 \u2013 f/8 (use ND to get there in bright light)", shutter:"1/250 \u2013 1/500s for crisp per-frame detail", iso:"As low as the light allows", fps:"120fps (240fps for extreme slow-mo)", wb:"Match the scene", focus:"AF-C tracking for moving subjects", note:"High frame rates need a lot of light per frame \u2014 shoot in bright conditions or add light.", idealLens:["Telephoto zoom (70-200mm)","Standard zoom (24-70mm)"], wantsTripod:false, wantsND:true, wantsMic:false, tips:["Bigger, more deliberate motion reads much better once it's slowed down.","120fps into a 24fps timeline gives 5x slow motion \u2014 plan that math before you shoot.","Bring more light than you think you need \u2014 high fps eats it fast."], summary:"Shoot with plenty of light, keep the motion bold, and let the frame rate do the drama." },
    "Timelapse": { aperture:"f/8 \u2013 f/11", shutter:"Interval: 1 frame every 2\u20135s for clouds/people, 10\u201330s for slower change", iso:"100 (base ISO)", fps:"24\u201330fps playback", wb:"Lock a manual white balance so frames don't shift", focus:"Manual focus, locked", note:"Total frames needed = final clip length in seconds \u00d7 playback fps \u2014 work backward from that to set your interval.", idealLens:["Wide-angle (10-24mm)"], wantsTripod:true, wantsND:true, wantsMic:false, tips:["Lock exposure and white balance manually \u2014 auto modes cause visible flicker between frames.","An intervalometer (built-in or external) is essentially required past a few minutes.","Faster-moving subjects (traffic, crowds) want a shorter interval than slow ones (clouds, stars)."], summary:"Lock every setting manually, pick an interval to match how fast the scene changes, and let it run." },
    "Hyperlapse": { aperture:"f/8 \u2013 f/11", shutter:"1/50\u20131/100s per frame", iso:"100\u2013400", fps:"24\u201330fps playback", wb:"Locked / manual", focus:"Manual, or locked between moves", note:"Unlike a timelapse, you physically move between each frame \u2014 keep the steps even.", idealLens:["Wide-angle (10-24mm)"], wantsTripod:false, wantsND:false, wantsMic:false, tips:["Keep your steps and framing consistent \u2014 uneven spacing shows up as a jerky result.","A dedicated hyperlapse app or a gimbal helps smooth the motion between shots.","Lock exposure so the scene doesn't flicker brighter and darker as you move."], summary:"Move in even, deliberate steps and keep exposure locked from the first frame to the last." },
    "Vlog / talking head": { aperture:"f/2.8 \u2013 f/4", shutter:"1/60s (180-degree rule at 30fps)", iso:"As needed for the room", fps:"30fps", wb:"Match your lighting, or set a custom white balance", focus:"AF-C with face or eye tracking", note:"Audio quality matters more than video quality here \u2014 prioritize the mic.", idealLens:["Standard zoom (24-70mm)","Wide-angle (10-24mm)"], wantsTripod:true, wantsND:false, wantsMic:true, tips:["A lav or shotgun mic close to you will outperform the camera's built-in mic every time.","One key light and a fill (even a reflector) evens out harsh shadows on the face.","Leave a little headroom in the frame, but not so much you look small."], summary:"Prioritize clean audio and even face lighting \u2014 the video settings are the easy part." },
    "Action / sports": { aperture:"f/2.8 \u2013 f/5.6", shutter:"1/120 \u2013 1/250s (a bit faster than the 180-degree rule, for crisper action)", iso:"Auto", fps:"60fps", wb:"Auto", focus:"Wide-area AF-C tracking", note:"Shooting at 60fps even for normal-speed footage gives you the option to slow it down later.", idealLens:["Telephoto zoom (70-200mm)"], wantsTripod:false, wantsND:false, wantsMic:false, tips:["Follow the subject with the camera rather than zooming to keep up.","A gimbal turns running-and-gunning footage from shaky to usable.","Frame a little loose \u2014 fast subjects drift out of tight crops."], summary:"Shoot a little faster than the rule of thumb calls for, track wide, and follow the motion." },
    "Low light / night": { aperture:"As wide as your lens allows (f/1.4 \u2013 f/2.8)", shutter:"1/24 \u2013 1/50s", iso:"3200\u201312800 depending on your camera's low-light performance", fps:"24fps", wb:"Auto, or Tungsten under artificial light", focus:"Manual \u2014 autofocus struggles in the dark", note:"A camera with strong high-ISO performance matters more here than almost any setting choice.", idealLens:["50mm prime","85mm prime"], wantsTripod:true, wantsND:false, wantsMic:false, tips:["Add a practical light into the scene wherever you can \u2014 a lamp, a phone screen, string lights.","Stabilize however possible \u2014 a slower shutter shows every bit of handheld movement.","Don't be afraid to break the 180-degree rule and go slower if you need the light."], summary:"Open up, accept the ISO you need, and add any practical light you can find." },
    "Interview": { aperture:"f/2.8 \u2013 f/4", shutter:"1/50 \u2013 1/60s", iso:"As low as the lighting allows", fps:"24\u201330fps", wb:"Custom white balance for your key light setup", focus:"Manual focus, locked once framed", note:"A simple 3-point lighting setup (key, fill, back) does more for the shot than any camera setting.", idealLens:["85mm prime","Standard zoom (24-70mm)"], wantsTripod:true, wantsND:false, wantsMic:true, tips:["Get the mic as close to the subject as you can, even if it means keeping it carefully out of frame.","Leave a bit of look-room in the direction the subject is facing.","Lock focus once they're framed \u2014 most interview subjects don't move much."], summary:"Light it properly, mic it closely, and lock the frame down \u2014 the camera does the rest." },
    "Aerial / drone": { aperture:"Often fixed on drones \u2014 control exposure with ND filters and shutter instead", shutter:"1/50 \u2013 1/60s (180-degree rule)", iso:"100\u2013200", fps:"24\u201330fps", wb:"Auto, or locked custom", focus:"Usually fixed or hyperfocal on drone cameras", note:"Match your ND filter strength to the light so you can hold the correct shutter speed.", idealLens:["Built-in phone lens"], wantsTripod:false, wantsND:true, wantsMic:false, tips:["Fly slow and smooth \u2014 cinematic aerials are about restraint, not speed.","Check local drone regulations and no-fly zones before you launch.","ND filters matched to conditions do more for footage quality than almost any camera setting here."], summary:"Filter the light to hold your shutter speed, and fly slower than feels natural." },
    "Music video / B-roll": { aperture:"f/1.8 \u2013 f/2.8", shutter:"1/50s (or break the rule intentionally for a stylized strobe look)", iso:"As needed", fps:"24fps (or 60fps for slow-motion cutaways)", wb:"Stylized \u2014 lean warm or cool to match the mood", focus:"AF-C, or manual depending on the move", note:"Gather more shot variety (wide, medium, close, detail) than feels necessary \u2014 cheap now, valuable in the edit.", idealLens:["Cinema prime","Telephoto zoom (70-200mm)"], wantsTripod:false, wantsND:true, wantsMic:false, tips:["Collect a mix of wide, medium, close-up, and detail shots for editing flexibility.","Let color and white balance choices match the song's mood \u2014 rules are meant to bend here.","A slider or gimbal move timed to the beat elevates even a simple shot."], summary:"Shoot more variety than feels necessary and let the edit and the music dictate the final look." }
  };

  var GENERIC_PHOTO = { aperture:"f/4 \u2013 f/5.6", shutter:"1/250s", iso:"Auto (100\u2013800)", wb:"Auto", focus:"Single-shot AF, center point", note:"A safe, versatile starting point \u2014 nudge it once you see how the shot looks.", idealLens:["Standard zoom (24-70mm)"], wantsTripod:false, wantsND:false, tips:["Check your histogram after the first frame and adjust from there.","Recompose after focusing if your subject isn't centered."], summary:"A balanced, general-purpose starting point for this shot." };
  var GENERIC_VIDEO = { aperture:"f/2.8 \u2013 f/4", shutter:"1/50s (180-degree rule at 24fps)", iso:"As needed", fps:"24fps", wb:"Auto", focus:"AF-C, smooth", note:"A safe, cinematic-leaning starting point.", idealLens:["Standard zoom (24-70mm)"], wantsTripod:false, wantsND:false, wantsMic:false, tips:["Keep white balance locked once you find a look you like.","Get a few extra seconds of handle at the start and end of each clip."], summary:"A balanced, general-purpose starting point for this shot." };

  var COMPOSITION_TIPS_BY_SCENE = {
    "Portrait":"Leave a little space in the direction your subject is looking.",
    "Landscape":"Put the horizon on the upper or lower third, not dead center.",
    "Wildlife":"Leave room in the frame for the animal to move into.",
    "Sports / action":"Frame a little loose \u2014 fast subjects drift out of tight crops.",
    "Street / candid":"Look for a strong background first, then wait for a subject to enter it.",
    "Macro / close-up":"Fill the frame \u2014 macro subjects read best big.",
    "Astrophotography":"Include a bit of foreground or horizon for scale against the sky.",
    "Night / low light":"A single point of interesting light anchors a dark frame well.",
    "Product / studio":"Keep the background clean and let the product hold the frame alone.",
    "Long exposure":"A strong foreground element gives the long exposure something to anchor to.",
    "Cinematic":"Leave headroom and look-room consistent with your other shots for a cohesive edit.",
    "Vlog / talking head":"Keep your eyes near the upper third of the frame.",
    "Interview":"Leave look-room in the direction your subject is facing.",
    "Aerial / drone":"Look for leading lines and patterns \u2014 they read especially well from above.",
    "Timelapse":"A static foreground element gives viewers a sense of scale for what's changing.",
    "Hyperlapse":"Keep a consistent subject or path in frame to anchor the motion.",
    "Slow motion":"Fill more of the frame with the subject \u2014 detail reads better slowed down.",
    "Music video / B-roll":"Vary your composition across shots \u2014 you'll want the contrast in the edit.",
    "Action / sports":"Track slightly ahead of the subject to leave room for its motion.",
    "Low light / night":"A visible light source in frame gives the eye somewhere to land.",
    "General":"Try the rule of thirds as a starting point, then adjust to taste."
  };

  /* =====================================================================
   * VOCABULARY for free-text keyword detection
   * =================================================================== */

  var VOCAB = {
    people: ["person","people","human","man","woman","boy","girl","child","baby","teenager","elderly person","couple","friends","family","crowd","tourist","traveler","student","teacher","doctor","nurse","police officer","firefighter","soldier","athlete","player","footballer","cricketer","basketball player","tennis player","runner","cyclist","swimmer","dancer","singer","musician","artist","actor","model","photographer","videographer","chef","worker","farmer","driver","rider","motorcyclist","skater","surfer","hiker","climber","fisherman","engineer","scientist","businessman","businesswoman","bride","groom","wedding"],
    wildlife: ["lion","tiger","leopard","cheetah","jaguar","snow leopard","clouded leopard","panther","cougar","puma","lynx","bobcat","caracal","serval","hyena","wolf","fox","jackal","coyote","bear","grizzly bear","polar bear","panda","red panda","elephant","rhino","hippo","giraffe","zebra","horse","donkey","cow","buffalo","bison","yak","goat","sheep","deer","stag","reindeer","moose","elk","antelope","gazelle","impala","camel","llama","alpaca","monkey","gorilla","chimpanzee","orangutan","baboon","lemur","sloth","koala","kangaroo","wombat","armadillo","anteater","meerkat","mongoose","otter","beaver","badger","raccoon","skunk","squirrel","chipmunk","rabbit","hare","hedgehog","porcupine","bat","whale","orca","dolphin","seal","sea lion","walrus"],
    birds: ["eagle","bald eagle","golden eagle","hawk","falcon","peregrine falcon","kestrel","kite","vulture","owl","barn owl","snowy owl","parrot","macaw","cockatoo","parakeet","pigeon","dove","crow","raven","magpie","sparrow","finch","robin","blue jay","cardinal","kingfisher","woodpecker","flamingo","peacock","ostrich","emu","penguin","albatross","pelican","seagull","swan","goose","duck","heron","egret","crane","stork","hummingbird","swallow","cuckoo","pheasant","turkey","rooster","hen","chick","bird in flight","perched bird","bird landing","bird taking off"],
    reptiles: ["snake","cobra","python","boa","viper","rattlesnake","anaconda","lizard","gecko","iguana","chameleon","monitor lizard","komodo dragon","crocodile","alligator","turtle","tortoise","sea turtle","frog","tree frog","toad","salamander","newt"],
    insects: ["butterfly","moth","dragonfly","damselfly","bee","bumblebee","wasp","hornet","ant","beetle","ladybug","grasshopper","locust","cricket insect","mantis","stick insect","caterpillar","fly","mosquito","firefly","spider","tarantula","scorpion","centipede","millipede","worm","snail","crab","lobster","shrimp","jellyfish","starfish","octopus","squid","seahorse"],
    marine: ["fish","shark","great white shark","hammerhead shark","ray","stingray","manta ray","eel","tuna","salmon","trout","goldfish","koi","catfish","piranha","swordfish","clownfish","pufferfish","coral reef","anemone","underwater scene","marine life"],
    plants: ["tree","forest","jungle","bush","grass","leaf","branch","flower","rose","lotus","sunflower","tulip","lily","orchid","jasmine","lavender","daisy","blossom","petals","vine","moss","fern","bamboo","cactus","palm tree","coconut tree","pine tree","oak tree","maple tree","autumn leaves","fallen leaves"],
    landscape: ["mountain","mountain range","hill","valley","cliff","canyon","cave","desert","dunes","oasis","beach","shore","coast","coastline","island","lake","pond","river","riverbank","river bank","stream","creek","waterfall","ocean","sea","bay","harbor","lagoon","wetland","swamp","marsh","meadow","grassland","savanna","rainforest","woodland","field","farmland","countryside","village","rural area","wilderness","national park","garden","park"],
    water: ["waves","calm water","rough water","choppy water","still water","ripples","reflection on water","wet surface","puddle","fountain","spray","splash","droplets","underwater","submerged","diving","snorkeling","swimming","surfing","sailing","boating"],
    urban: ["city","cityscape","town","street","road","highway","alley","avenue","intersection","crosswalk","sidewalk","building","skyscraper","tower","office","apartment","house","villa","mansion","castle","palace","temple","church","mosque","monument","statue","bridge","tunnel","station","railway","metro","airport","market","mall","restaurant","cafe","hotel","stadium","school","university","hospital","factory","construction site","rooftop","balcony","downtown","city center","neighborhood","urban area","industrial area","residential area"],
    vehicles: ["car","sedan","SUV","sports car","supercar","hypercar","race car","F1 car","formula 1","truck","pickup truck","bus","van","taxi","motorcycle","motorbike","scooter","bicycle","train","tram","airplane","jet","fighter jet","helicopter","drone","rocket","ship","yacht","boat","canoe","kayak","traffic","motorsport"]
  };

  var TIME_WORDS = ["morning","noon","afternoon","evening","sunset","sunrise","dawn","dusk","twilight","golden hour","blue hour","night","midnight","moonlight","starry night"];
  var BRIGHTNESS_WORDS = ["bright","very bright","extremely bright","blazing light","well-lit","moderate light","dim","dark","pitch dark","low light","poor light","minimal light","faint light","weak light","shadowy","ambient light","natural light","artificial light"];
  var WEATHER_WORDS = ["sunny","sunlight","cloudy","partly cloudy","overcast","clear sky","blue sky","gray sky","rain","rainy","light rain","heavy rain","drizzle","downpour","monsoon","storm","stormy","thunderstorm","lightning","hail","snow","blizzard","sleet","fog","mist","haze","dust","sandstorm","wind","breeze","gust","cyclone","hurricane","typhoon","tornado","heatwave","cold","freezing","frost","icy","humid","hot","warm weather","cool weather","chilly"];
  var LIGHT_DIRECTION_WORDS = ["front light","backlight","backlit","side light","top light","rim light","edge light","hair light","window light","key light","fill light","practical light"];
  var LIGHT_QUALITY_WORDS = ["hard light","soft light","diffused light","direct light","specular light","flash","strobe","studio light","LED light","tungsten","fluorescent light","candlelight","neon","street light","headlights","fire light","moonlight glow"];
  var COLOR_TEMP_WORDS = ["warm light","golden light","cool light","blue light","neutral light","daylight","warm tones","cool tones"];
  var MOOD_WORDS = ["bright and airy","clean look","soft mood","dreamy","ethereal","romantic","cozy","cheerful","dramatic","cinematic","moody","dark mood","mysterious","eerie","intense","melancholic","peaceful","calm","serene","powerful","epic","majestic","vibrant","energetic","dynamic","minimal","luxurious","elegant","vintage","nostalgic","retro","futuristic","gritty","documentary style"];
  var MOVEMENT_TIERS = {
    still: ["still","stationary","static","motionless","sitting","standing","sleeping","resting","posed"],
    slow: ["slow","walking","strolling","grazing","drifting slowly","gentle movement"],
    moderate: ["moderate speed","jogging","swimming","cycling","driving normally"],
    fast: ["fast","quickly","moving quickly","running","sprinting","racing","galloping","jumping","leaping","diving","splashing","flying"],
    veryFast: ["very fast","extremely fast","rapid","high-speed","high speed"]
  };
  var FAST_SUBJECTS = ["cheetah","falcon","peregrine falcon","hummingbird","race car","f1","formula 1","bird in flight","sprinter","bullet train","motorsport"];
  var MOTION_INTENT_WORDS = {
    freeze: ["freeze motion","freeze movement","freeze action","tack sharp","no motion blur"],
    blur: ["motion blur","intentional motion blur","creative motion blur","long exposure","light trails","car trails","traffic trails","silky water","smooth water","flowing water","panning shot","light trail"]
  };
  var FOCUS_PRIORITY_WORDS = ["eyes sharp","sharp eyes","eye sharpness","focus on the eyes","tack sharp focus","sharp focus"];
  var COMPOSITION_WORDS = ["rule of thirds","symmetry","leading lines","negative space","close-up","close up","wide shot","extreme wide shot","top-down view","overhead view","bird's-eye view","low angle","high angle","eye-level shot","silhouette","bokeh","background blur","shallow depth of field","deep depth of field","panorama","panoramic view"];
  var LENS_WORDS = ["wide-angle lens","ultra-wide lens","telephoto lens","super telephoto lens","macro lens","fisheye lens","tilt-shift lens","prime lens","zoom lens","35mm lens","50mm lens","85mm lens","100mm lens","135mm lens","200mm lens","300mm lens","400mm lens","500mm lens","600mm lens","70-200mm","24-70mm","16-35mm","100-400mm","150-600mm"];
  var GEAR_WORDS = ["tripod","monopod","gimbal","stabilizer","slider","ND filter","polarizer","CPL filter","external flash","speedlight","LED panel","softbox","reflector","diffuser","ring light","microphone","lavalier mic","shotgun mic","drone"];
  var VIDEO_STYLE_WORDS = {
    "Slow motion": ["slow motion","slow-mo","slowmo"],
    "Timelapse": ["timelapse","time lapse","time-lapse"],
    "Hyperlapse": ["hyperlapse"],
    "Interview": ["interview"],
    "Vlog / talking head": ["vlog","talking head","youtube video"],
    "Aerial / drone": ["drone shot","aerial shot","from above with a drone"],
    "Music video / B-roll": ["music video","b-roll","b roll"]
  };
  var VIDEO_HINT_WORDS = ["video","fps","frame rate","vlog","timelapse","time lapse","slow motion","slow-mo","hyperlapse","cinematic","b-roll","b roll","footage","film clip","recording a clip"];

  var SUBJECT_EMOJI = {
    tiger:"\ud83d\udc05", lion:"\ud83e\udd81", cheetah:"\ud83d\udc06", leopard:"\ud83d\udc06", elephant:"\ud83d\udc18", giraffe:"\ud83e\udd92", zebra:"\ud83e\udd93",
    bear:"\ud83d\udc3b", wolf:"\ud83d\udc3a", fox:"\ud83e\udd8a", monkey:"\ud83d\udc12", gorilla:"\ud83e\udd8d", panda:"\ud83d\udc3c", koala:"\ud83d\udc28",
    rabbit:"\ud83d\udc07", deer:"\ud83e\udd8c", horse:"\ud83d\udc34", "bird in flight":"\ud83e\udd85", eagle:"\ud83e\udd85", owl:"\ud83e\udd89", parrot:"\ud83e\udd9c",
    flamingo:"\ud83e\udda9", peacock:"\ud83e\udd9a", penguin:"\ud83d\udc27", swan:"\ud83e\udda2", fish:"\ud83d\udc1f", shark:"\ud83e\udd88", dolphin:"\ud83d\udc2c",
    whale:"\ud83d\udc0b", turtle:"\ud83d\udc22", snake:"\ud83d\udc0d", butterfly:"\ud83e\udd8b", bee:"\ud83d\udc1d", spider:"\ud83d\udd77\ufe0f", crab:"\ud83e\udd80",
    octopus:"\ud83d\udc19", person:"\ud83e\uddcd", man:"\ud83e\uddcd", woman:"\ud83e\uddcd", child:"\ud83e\uddd2", baby:"\ud83d\udc76", athlete:"\ud83c\udfc3",
    runner:"\ud83c\udfc3", cyclist:"\ud83d\udeb4", surfer:"\ud83c\udfc4", car:"\ud83d\ude97", "race car":"\ud83c\udfce\ufe0f", motorcycle:"\ud83c\udfcd\ufe0f",
    airplane:"\u2708\ufe0f", helicopter:"\ud83d\ude81", boat:"\u26f5", train:"\ud83d\ude86"
  };
  var CATEGORY_EMOJI = { subject:"\ud83d\udc3e", weather:"\u2601\ufe0f", time:"\ud83d\udd52", brightness:"\ud83d\udca1", light:"\ud83d\udca1", movement:"\ud83c\udfc3", mood:"\ud83c\udfa8", focus:"\ud83d\udc41\ufe0f", composition:"\ud83d\uddbc\ufe0f" };

  /* =====================================================================
   * DETECTION ENGINE
   * =================================================================== */

  function normalize(text){
    return (text || "").toLowerCase()
      .replace(/[\u2019']s\b/g, "")
      .replace(/[.,!?;:()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildPhraseIndex(){
    var list = [];
    function add(arr, category, sub){
      arr.forEach(function(p){ list.push({ phrase: p.toLowerCase(), category: category, sub: sub || null }); });
    }
    Object.keys(VOCAB).forEach(function(subKey){ add(VOCAB[subKey], 'subject', subKey); });
    add(TIME_WORDS, 'time');
    add(BRIGHTNESS_WORDS, 'brightness');
    add(WEATHER_WORDS, 'weather');
    add(LIGHT_DIRECTION_WORDS, 'light');
    add(LIGHT_QUALITY_WORDS, 'light');
    add(COLOR_TEMP_WORDS, 'colorTemp');
    add(MOOD_WORDS, 'mood');
    add(FOCUS_PRIORITY_WORDS, 'focus');
    add(COMPOSITION_WORDS, 'composition');
    add(LENS_WORDS, 'lens');
    add(GEAR_WORDS, 'gear');
    Object.keys(MOTION_INTENT_WORDS).forEach(function(k){ add(MOTION_INTENT_WORDS[k], 'motionIntent', k); });
    Object.keys(MOVEMENT_TIERS).forEach(function(k){ add(MOVEMENT_TIERS[k], 'movement', k); });
    list.sort(function(a,b){ return b.phrase.split(' ').length - a.phrase.split(' ').length; });
    return list;
  }
  var PHRASE_INDEX = buildPhraseIndex();

  function detectFromText(text){
    var norm = normalize(text);
    var working = ' ' + norm + ' ';
    var found = { subject:[], time:[], brightness:[], weather:[], light:[], colorTemp:[], mood:[], focus:[], composition:[], lens:[], gear:[], motionIntent:[], movement:[] };
    PHRASE_INDEX.forEach(function(entry){
      var needle = ' ' + entry.phrase + ' ';
      if(working.indexOf(needle) !== -1){
        if(entry.sub){ found[entry.category].push({ term: entry.phrase, sub: entry.sub }); }
        else { found[entry.category].push(entry.phrase); }
        working = working.split(needle).join(' ');
      }
    });
    var paddedNorm = ' ' + norm + ' ';
    var impliesFast = FAST_SUBJECTS.some(function(s){ return paddedNorm.indexOf(' ' + s + ' ') !== -1; });
    var explicit = {};
    var mShutter = norm.match(/\b1\s*\/\s*(\d{2,5})/);
    if(mShutter){ explicit.shutter = '1/' + mShutter[1] + 's'; }
    else {
      var mSec = norm.match(/\b(\d{1,3})\s*(second|sec)s?\b/);
      if(mSec){ explicit.shutter = mSec[1] + 's'; }
    }
    var mAperture = norm.match(/\bf\s*\/?\s*(\d{1,2}(?:\.\d)?)\b/);
    if(mAperture){ explicit.aperture = 'f/' + mAperture[1]; }
    var mIso = norm.match(/\biso\s*(\d{2,6})\b/);
    if(mIso){ explicit.iso = mIso[1]; }
    return { found: found, impliesFast: impliesFast, explicit: explicit, raw: norm };
  }

  function resolveMovementTier(found, impliesFast){
    var order = ['veryFast','fast','moderate','slow','still'];
    for(var i=0;i<order.length;i++){
      if(found.movement.some(function(m){ return m.sub === order[i]; })) return order[i];
    }
    return impliesFast ? 'fast' : null;
  }

  function inferSceneType(found, mode, explicitStyle){
    if(explicitStyle) return explicitStyle;
    var subs = found.subject.map(function(s){ return s.sub; });
    var text = found.raw || '';

    if(mode === 'video'){
      for(var key in VIDEO_STYLE_WORDS){
        if(VIDEO_STYLE_WORDS[key].some(function(w){ return text.indexOf(w) !== -1; })) return key;
      }
      if(subs.indexOf('wildlife')!==-1 || subs.indexOf('birds')!==-1 || subs.indexOf('vehicles')!==-1) return 'Action / sports';
      if(/\bnight\b|starry night/.test(text) || found.brightness.some(function(b){return /dark|dim/.test(b);})) return 'Low light / night';
      if(subs.indexOf('people')!==-1) return 'Cinematic';
      if(subs.indexOf('landscape')!==-1) return 'Aerial / drone';
      return null;
    }

    if(subs.indexOf('wildlife')!==-1 || subs.indexOf('birds')!==-1) return 'Wildlife';
    if(subs.indexOf('vehicles')!==-1) return 'Sports / action';
    if(subs.indexOf('insects')!==-1 || found.composition.indexOf('close-up')!==-1 || found.composition.indexOf('close up')!==-1) return 'Macro / close-up';
    if(/milky way|galaxy|star trail|\bstars\b/.test(text) && (/\bnight\b/.test(text) || text.indexOf('starry night')!==-1)) return 'Astrophotography';
    if(/\bnight\b/.test(text) || text.indexOf('starry night')!==-1 || found.brightness.some(function(b){return /dark|dim|low light|poor light/.test(b);})) return 'Night / low light';
    if(subs.indexOf('people')!==-1) return 'Portrait';
    if(subs.indexOf('urban')!==-1) return 'Street / candid';
    if(subs.indexOf('landscape')!==-1 || subs.indexOf('plants')!==-1 || subs.indexOf('water')!==-1 || subs.indexOf('marine')!==-1) return 'Landscape';
    if(found.motionIntent.some(function(m){ return m.sub === 'blur'; })) return 'Long exposure';
    return null;
  }

  function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function buildShotSentence(found, sceneType, mode){
    var subjectTerm = found.subject.length ? found.subject[0].term : null;
    var envTerm = null;
    for(var i=0;i<found.subject.length;i++){
      if(['landscape','urban','water','plants','marine'].indexOf(found.subject[i].sub) !== -1){ envTerm = found.subject[i].term; break; }
    }
    var lightBits = found.weather.concat(found.brightness).concat(found.time);
    var moveTerm = found.movement.length ? found.movement[0].term : null;

    if(!subjectTerm && !envTerm && !lightBits.length && !moveTerm){
      return sceneType ? ("A " + sceneType.toLowerCase() + " shot, based on what you selected.") : "A shot based on what you selected \u2014 add a description any time for more tailored settings.";
    }
    var parts = [];
    parts.push(subjectTerm ? capitalize(subjectTerm) : (sceneType ? capitalize(sceneType.toLowerCase()) : "Your subject"));
    if(envTerm && envTerm !== subjectTerm) parts.push("near a " + envTerm);
    if(lightBits.length) parts.push("in " + lightBits[0] + " conditions");
    if(moveTerm) parts.push(moveTerm + " movement");
    return parts.join(", ") + ".";
  }

  function buildDetectedChips(found){
    var chips = [];
    function pushTerm(term, cat){
      if(chips.length >= 9 || !term) return;
      var emoji = SUBJECT_EMOJI[term] || CATEGORY_EMOJI[cat] || '\u2022';
      chips.push(emoji + ' ' + capitalize(term));
    }
    found.subject.slice(0,2).forEach(function(s){ pushTerm(s.term, 'subject'); });
    found.weather.slice(0,1).forEach(function(w){ pushTerm(w, 'weather'); });
    found.time.slice(0,1).forEach(function(t){ pushTerm(t, 'time'); });
    found.brightness.slice(0,1).forEach(function(b){ pushTerm(b, 'brightness'); });
    found.movement.slice(0,1).forEach(function(m){ pushTerm(m.term, 'movement'); });
    found.focus.slice(0,1).forEach(function(f){ pushTerm(f, 'focus'); });
    found.mood.slice(0,1).forEach(function(m){ pushTerm(m, 'mood'); });
    found.light.slice(0,1).forEach(function(l){ pushTerm(l, 'light'); });
    return chips;
  }

  /* =====================================================================
   * SETTINGS COMBINATION ENGINE
   * =================================================================== */

  function cameraClass(brand){
    if(brand === 'Apple' || brand === 'Samsung' || brand === 'Google' || brand === 'OnePlus' || brand === 'Xiaomi' || brand === 'Oppo' || brand === 'Vivo' || brand === 'Motorola') return 'phone';
    if(brand === 'GoPro') return 'action';
    if(brand === 'DJI') return 'drone';
    return 'ilc';
  }

  function classNote(camClass){
    if(camClass === 'phone') return "Keep ISO under 800\u20131600 where you can \u2014 phone sensors get noisy fast. Use Pro/Manual mode for direct control.";
    if(camClass === 'action') return "Action cameras have a fixed aperture \u2014 use exposure compensation and ISO to fine-tune instead.";
    if(camClass === 'drone') return "Most drone cameras have a fixed or narrow aperture \u2014 lean on ND filters and shutter speed for exposure control.";
    return null;
  }

  function pickLensFromChips(idealList, ownedLenses){
    for(var i=0;i<idealList.length;i++){
      if(ownedLenses.indexOf(idealList[i]) !== -1) return idealList[i] + " \u2014 the best match on hand for this.";
    }
    if(ownedLenses.length) return ownedLenses[0] + " (not an exact match, but the closest thing you've got).";
    return idealList[0] + " if you have one, or your kit lens at its widest.";
  }

  function extraGearTips(data, ownedGear, isVideo){
    var tips = [];
    if(data.wantsTripod && ownedGear.indexOf('Tripod') === -1) tips.push("This one really benefits from a tripod \u2014 worth adding if you can.");
    if(data.wantsND && ownedGear.indexOf('ND filters') === -1) tips.push("ND filters would help control exposure here without stopping the aperture down.");
    if(isVideo && data.wantsMic && ownedGear.indexOf('Lavalier mic') === -1) tips.push("Consider an external mic \u2014 built-in camera audio is usually the weakest link.");
    return tips;
  }

  function computeSettings(rawText, uiState){
    var detection = detectFromText(rawText);
    var found = detection.found;

    var mode = uiState.mode;
    if(VIDEO_HINT_WORDS.some(function(w){ return detection.raw.indexOf(w) !== -1; })) mode = 'video';
    var isVideo = mode === 'video';

    var sceneType = inferSceneType(found, mode, uiState.style);
    var base = sceneType ? (isVideo ? VIDEO_DATA[sceneType] : PHOTO_DATA[sceneType]) : (isVideo ? GENERIC_VIDEO : GENERIC_PHOTO);

    var reasons = [];
    reasons.push(sceneType ? ("this reads as a " + sceneType.toLowerCase() + " shot, so it starts from that baseline") : "there wasn't a strong specific category here, so this starts from a balanced general-purpose baseline");

    var result = {
      aperture: base.aperture, shutter: base.shutter, iso: base.iso, fps: isVideo ? base.fps : 'N/A',
      wb: base.wb, focus: base.focus, drive: 'Single shot', metering: 'Evaluative / matrix',
      format: 'RAW', stabilization: 'Handheld is fine', note: base.note
    };
    if(sceneType === 'Sports / action' || sceneType === 'Wildlife' || sceneType === 'Action / sports'){
      result.drive = 'High-speed continuous / burst';
    }

    var tier = resolveMovementTier(found, detection.impliesFast);
    if(tier === 'veryFast'){
      if(!isVideo) result.shutter = '1/2000s or faster';
      result.drive = 'High-speed continuous / burst';
      if(!/AF-C|tracking/i.test(result.focus)) result.focus = 'AF-C with subject tracking';
      reasons.push("the very fast movement needs a very fast shutter and continuous tracking to keep it sharp");
    } else if(tier === 'fast'){
      if(!isVideo) result.shutter = '1/1000 \u2013 1/1500s';
      result.drive = 'High-speed continuous / burst';
      reasons.push("the quick movement calls for a fast shutter and burst shooting so you don't miss the peak of it");
    } else if(tier === 'moderate'){
      if(!isVideo) result.shutter = '1/500s';
    } else if(tier === 'slow' && !sceneType && !isVideo){
      result.shutter = '1/250s';
    } else if(tier === 'still' && !sceneType && !isVideo){
      result.shutter = '1/125s';
    }

    var wantsBlur = found.motionIntent.some(function(m){ return m.sub === 'blur'; });
    if(wantsBlur){
      result.shutter = 'A few seconds or slower, on a tripod';
      result.iso = '100 (base ISO)';
      reasons.push("since you're after intentional motion blur rather than freezing it, the shutter comes down instead of up \u2014 use a tripod, and an ND filter if it's daylight");
    }

    var isLowLight = found.brightness.some(function(b){ return /dark|dim|low light|poor light|faint|weak/.test(b); }) ||
      found.time.indexOf('night')!==-1 || found.time.indexOf('starry night')!==-1 || found.time.indexOf('midnight')!==-1;
    var isBright = found.brightness.some(function(b){ return /bright/.test(b); }) ||
      found.weather.indexOf('sunny')!==-1 || found.weather.indexOf('sunlight')!==-1 || found.weather.indexOf('clear sky')!==-1;

    if(isLowLight && !wantsBlur){
      if(tier === 'fast' || tier === 'veryFast'){
        result.iso = 'Raised to 3200\u20136400+ rather than slowing the shutter';
        reasons.push("with both low light and real movement, it's better to push ISO up than let the shutter drop and risk blur");
      } else {
        result.iso = '1600\u20136400';
        result.aperture = 'As wide as your lens allows';
        reasons.push("the low light calls for a wider aperture and higher ISO");
      }
    } else if(isBright && !wantsBlur){
      result.iso = (tier==='fast'||tier==='veryFast') ? '200\u2013800' : '100\u2013200';
    }

    if(found.colorTemp.some(function(c){ return /warm|golden/.test(c); }) || found.time.indexOf('golden hour')!==-1 || found.time.indexOf('sunset')!==-1 || found.time.indexOf('sunrise')!==-1){
      result.wb = 'Daylight, or a touch warm to hold onto the golden light';
    } else if(found.light.indexOf('tungsten')!==-1 || found.light.indexOf('street light')!==-1 || found.light.indexOf('neon')!==-1 || found.light.indexOf('candlelight')!==-1){
      result.wb = 'Tungsten, or Auto with a manual correction';
    } else if(found.colorTemp.some(function(c){ return /cool|blue/.test(c); })){
      result.wb = 'Cool / Shade preset, or a custom cool white balance';
    }

    if(found.focus.length){
      result.focus = result.focus + ' \u2014 prioritizing ' + found.focus[0];
      reasons.push("since you called out " + found.focus[0] + ", that's the focus point everything else supports");
    }

    if(detection.explicit.shutter){ result.shutter = detection.explicit.shutter + ' (as you specified)'; reasons.push('using the exact shutter speed you gave'); }
    if(detection.explicit.aperture){ result.aperture = detection.explicit.aperture + ' (as you specified)'; reasons.push('using the exact aperture you gave'); }
    if(detection.explicit.iso){ result.iso = 'ISO ' + detection.explicit.iso + ' (as you specified)'; reasons.push('using the exact ISO you gave'); }

    var lensRec;
    if(found.lens.length){
      lensRec = "You mentioned a " + found.lens[0] + " \u2014 that works well here.";
    } else {
      lensRec = pickLensFromChips(base.idealLens || ['Standard zoom (24-70mm)'], uiState.lenses);
    }

    var tips = (base.tips || []).slice(0,2).concat(extraGearTips(base, uiState.gear, isVideo));
    var camClass = cameraClass(uiState.brand);
    var cNote = classNote(camClass);
    if(cNote) tips.push(cNote);
    if(found.gear.length) tips.push("Since you mentioned a " + found.gear[0] + ", put it to use here.");
    tips = tips.slice(0,4);

    var blurbs = {
      aperture: wantsBlur ? "Lets more light in for the long exposure"
        : (tier==='fast'||tier==='veryFast') ? "Wide enough to keep the shutter fast"
        : (sceneType==='Landscape' || sceneType==='Product / studio') ? "Sharp across the whole frame"
        : (isLowLight) ? "Lets in more light"
        : "Balances depth and light",
      shutter: wantsBlur ? "Creates the motion blur on purpose"
        : (tier==='fast'||tier==='veryFast') ? "Freezes the motion sharply"
        : "Prevents camera shake",
      iso: isLowLight ? "Enough sensitivity for the low light"
        : isBright ? "Kept low for the cleanest image"
        : "Balances noise and exposure",
      fps: (sceneType==='Slow motion') ? "Smooth, detailed slow motion"
        : (sceneType==='Cinematic' || sceneType==='Interview' || sceneType==='Music video / B-roll') ? "Classic, natural-looking motion"
        : "Standard, versatile frame rate"
    };

    return {
      settings: result, lensRec: lensRec, why: capitalize(reasons.join('; ')) + '.',
      compTip: COMPOSITION_TIPS_BY_SCENE[sceneType] || COMPOSITION_TIPS_BY_SCENE.General,
      proTip: tips.length ? tips[0] : 'Check your result and adjust from there.',
      summary: base.summary, sceneType: sceneType, mode: mode, found: found, blurbs: blurbs
    };
  }

  /* =====================================================================
   * "ANALYZING" SEQUENCE (real steps, paced for clarity -- not a claim
   * that any external process ran)
   * =================================================================== */

  var ANALYZING_STEPS = ["Identifying subject","Reading lighting conditions","Analyzing movement","Checking environment","Matching camera settings","Optimizing exposure","Preparing recommendation"];
  var LOADING_TIPS = [
    "Faster shutter speeds help freeze movement in wildlife and sports.",
    "Golden hour produces softer, warmer directional light.",
    "Eye-detect AF is especially useful for portraits and wildlife.",
    "The 180-degree shutter rule keeps video motion looking natural.",
    "A small aperture like f/11 gives the deepest depth of field on most lenses.",
    "Back-button focus separates focusing from the shutter for more control.",
    "A polarizing filter cuts glare and deepens blue skies at 90\u00b0 to the sun.",
    "Shooting in RAW keeps far more detail available to recover while editing.",
    "A sharp grainy shot beats a blurry clean one \u2014 don't fear raising ISO.",
    "For panning shots, try to match your shutter speed to the subject's speed.",
    "The rule of thirds is a starting point, not a law \u2014 break it on purpose.",
    "Manual white balance avoids color shifts under mixed indoor lighting.",
    "A lens hood helps more with contrast and flare than most people expect.",
    "Continuous autofocus (AF-C / AI Servo) tracks subjects that keep moving."
  ];
  var STEP_INTERVAL_MS = 1300;
  var FINAL_PAUSE_MS = 900;

  function pickTip(excludeText){
    var pool = excludeText ? LOADING_TIPS.filter(function(f){ return f !== excludeText; }) : LOADING_TIPS;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function runAnalyzingSequence(onDone){
    analyzingStepsEl.innerHTML = '';
    analyzingSection.classList.remove('is-hidden');
    document.body.classList.add('modal-open');
    resultsSection.classList.add('is-hidden');
    analyzingFactEl.textContent = pickTip();
    if(progressFillEl){
      progressFillEl.classList.remove('is-filling');
      void progressFillEl.offsetWidth; /* restart the CSS transition on repeat runs */
      progressFillEl.classList.add('is-filling');
    }
    var i = 0;
    function step(){
      if(i < ANALYZING_STEPS.length){
        var li = document.createElement('li');
        li.innerHTML = '<span class="check">\u2713</span>' + ANALYZING_STEPS[i];
        analyzingStepsEl.appendChild(li);
        analyzingFactEl.textContent = pickTip(analyzingFactEl.textContent);
        i++;
        setTimeout(step, STEP_INTERVAL_MS);
      } else {
        setTimeout(onDone, FINAL_PAUSE_MS);
      }
    }
    step();
  }

  /* =====================================================================
   * DOM WIRING
   * =================================================================== */

  var shotInput = document.getElementById('shotInput');
  var analyzeBtn = document.getElementById('analyzeBtn');
  var formHint = document.getElementById('formHint');
  var setupHint = document.getElementById('setupHint');
  var setupCard = document.getElementById('setupCard');
  var brandSelect = document.getElementById('brandSelect');
  var modelSelect = document.getElementById('modelSelect');
  var customCameraInput = document.getElementById('customCamera');
  var lensChipsEl = document.getElementById('lensChips');
  var gearChipsEl = document.getElementById('gearChips');
  var styleChipsEl = document.getElementById('styleChips');
  var switchButtons = document.querySelectorAll('.switch-btn');
  var analyzingSection = document.getElementById('analyzingSection');
  var analyzingStepsEl = document.getElementById('analyzingSteps');
  var analyzingFactEl = document.getElementById('analyzingFact');
  var progressFillEl = document.getElementById('progressFill');
  var resultsSection = document.getElementById('resultsSection');
  var shotSentenceEl = document.getElementById('shotSentence');
  var detectedChipsEl = document.getElementById('detectedChips');
  var heroRowsEl = document.getElementById('heroRows');
  var settingsGridEl = document.getElementById('settingsGrid');
  var lensRecEl = document.getElementById('lensRec');
  var whyTextEl = document.getElementById('whyText');
  var compTipEl = document.getElementById('compTip');
  var proTipEl = document.getElementById('proTip');

  var currentMode = 'photo';
  var currentStyle = null;
  var selectedLenses = new Set();
  var selectedGear = new Set();

  var HERO_ICONS = {
    aperture: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v4M21 12h-4M12 21v-4M3 12h4M18.4 5.6l-2.8 2.8M18.4 18.4l-2.8-2.8M5.6 18.4l2.8-2.8M5.6 5.6l2.8 2.8"/></svg>',
    shutter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    iso: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/></svg>',
    fps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9.5 8.5v7l6-3.5-6-3.5z" fill="currentColor" stroke="none"/></svg>'
  };

  function escapeHtml(str){
    if(typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
  }

  function populateBrands(){
    Object.keys(CAMERAS).forEach(function(brand){
      var opt = document.createElement('option'); opt.value = brand; opt.textContent = brand;
      brandSelect.appendChild(opt);
    });
    populateModels(brandSelect.value);
  }
  function populateModels(brand){
    modelSelect.innerHTML = '';
    if(brand === 'Other'){
      modelSelect.disabled = true; customCameraInput.classList.remove('is-hidden');
    } else {
      modelSelect.disabled = false; customCameraInput.classList.add('is-hidden'); customCameraInput.value = '';
      CAMERAS[brand].forEach(function(model){
        var opt = document.createElement('option'); opt.value = model; opt.textContent = model;
        modelSelect.appendChild(opt);
      });
    }
  }
  function renderChipRow(container, items, selectedSet){
    container.innerHTML = '';
    items.forEach(function(label){
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'chip'; btn.textContent = label; btn.setAttribute('aria-pressed','false');
      btn.addEventListener('click', function(){
        if(selectedSet.has(label)){ selectedSet.delete(label); btn.classList.remove('is-active'); btn.setAttribute('aria-pressed','false'); }
        else { selectedSet.add(label); btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true'); }
      });
      container.appendChild(btn);
    });
  }
  function renderStyleChips(){
    var prevStyle = currentStyle;
    styleChipsEl.innerHTML = ''; currentStyle = null;
    STYLES[currentMode].forEach(function(label){
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'chip'; btn.textContent = label; btn.setAttribute('aria-pressed','false');
      if(label === prevStyle){ btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true'); currentStyle = label; }
      btn.addEventListener('click', function(){
        if(currentStyle === label){
          currentStyle = null; btn.classList.remove('is-active'); btn.setAttribute('aria-pressed','false');
        } else {
          styleChipsEl.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('is-active'); c.setAttribute('aria-pressed','false'); });
          btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true'); currentStyle = label;
        }
      });
      styleChipsEl.appendChild(btn);
    });
  }

  function setModeUI(mode){
    currentMode = mode;
    switchButtons.forEach(function(b){
      var active = b.dataset.mode === mode;
      b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    renderStyleChips();
  }

  function renderResults(result){
    if(result.mode !== currentMode) setModeUI(result.mode);

    shotSentenceEl.textContent = buildShotSentence(result.found, result.sceneType, result.mode);
    var chips = buildDetectedChips(result.found);
    detectedChipsEl.innerHTML = chips.length
      ? chips.map(function(c){ return '<span class="chip">'+escapeHtml(c)+'</span>'; }).join('')
      : '<span class="chip">General baseline \u2014 no specific keywords detected</span>';

    var s = result.settings;
    var b = result.blurbs;
    var heroRows = [
      ['aperture','Aperture', s.aperture, b.aperture],
      ['shutter','Shutter speed', s.shutter, b.shutter],
      ['iso','ISO', s.iso, b.iso]
    ];
    if(result.mode === 'video') heroRows.push(['fps','Frame rate', s.fps, b.fps]);
    heroRowsEl.innerHTML = heroRows.map(function(r){
      return '<div class="hero-row"><div class="hero-icon">'+HERO_ICONS[r[0]]+'</div>'+
        '<div class="hero-body"><div class="hero-label">'+escapeHtml(r[1])+'</div>'+
        '<div class="hero-value">'+escapeHtml(String(r[2]))+'</div></div>'+
        '<div class="hero-blurb">'+escapeHtml(r[3])+'</div></div>';
    }).join('');

    var rows = [['White balance', s.wb], ['Focus mode', s.focus], ['Drive mode', s.drive], ['Metering', s.metering], ['File format', s.format], ['Stabilization', s.stabilization]];
    settingsGridEl.innerHTML = rows.map(function(r){
      return '<div class="setting-item"><span class="setting-label">'+escapeHtml(r[0])+'</span><span class="setting-value">'+escapeHtml(String(r[1]))+'</span></div>';
    }).join('');

    lensRecEl.textContent = result.lensRec;
    whyTextEl.textContent = result.why;
    compTipEl.textContent = result.compTip;
    proTipEl.textContent = result.proTip;
  }

  function onAnalyzeClick(){
    formHint.textContent = '';
    setupHint.textContent = '';

    var missing = [];
    if(!currentStyle) missing.push('a shooting type');
    if(selectedLenses.size === 0) missing.push('at least one lens');
    if(selectedGear.size === 0) missing.push('at least one gear item');
    if(missing.length){
      var missingText = missing.length > 1
        ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1]
        : missing[0];
      setupHint.textContent = 'Select ' + missingText + ' above to continue.';
      setupCard.scrollIntoView({ behavior:'smooth', block:'start' });
      return;
    }

    var text = shotInput.value.trim();
    if(!text){
      formHint.textContent = "Add a description of the shot.";
      return;
    }
    var uiState = {
      mode: currentMode, style: currentStyle, brand: brandSelect.value, model: modelSelect.value,
      lenses: Array.from(selectedLenses), gear: Array.from(selectedGear)
    };
    analyzeBtn.disabled = true;
    runAnalyzingSequence(function(){
      var result = computeSettings(text, uiState);
      renderResults(result);
      analyzingSection.classList.add('is-hidden');
      document.body.classList.remove('modal-open');
      resultsSection.classList.remove('is-hidden');
      resultsSection.scrollIntoView({ behavior:'smooth', block:'start' });
      analyzeBtn.disabled = false;
    });
  }

  function init(){
    populateBrands();
    renderChipRow(lensChipsEl, LENSES, selectedLenses);
    renderChipRow(gearChipsEl, GEAR, selectedGear);
    renderStyleChips();
    switchButtons.forEach(function(btn){
      btn.addEventListener('click', function(){ setModeUI(btn.dataset.mode); });
    });
    brandSelect.addEventListener('change', function(){ populateModels(brandSelect.value); });
    analyzeBtn.addEventListener('click', onAnalyzeClick);
  }

  init();
})();
