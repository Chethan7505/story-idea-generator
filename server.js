const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Story Ideas Database
const storyIdeas = {
  fantasy: {
    dragon: [
      "In a world where dragons are considered extinct, a young archaeologist discovers a dragon egg hidden in an ancient temple. As the egg begins to hatch, she realizes the dragon is sentient and can communicate through visions. Together, they must uncover the truth about why dragons disappeared and prevent a dark force from returning.",
      "A dragon trainer discovers that the dragon she's bonded with for years is not a dragon at all, but a human cursed to take that form. The curse can only be broken by true love, but the trainer must decide if she's willing to sacrifice her career and village loyalty to save her companion.",
      "Dragons have always been protectors of humanity, but one dragon becomes fascinated by human art and abandons its duty. As darkness encroaches on the kingdom, the dragon must choose between its newfound passion and its ancient responsibility."
    ],
    princess: [
      "A princess who was raised in isolation must navigate a political marriage, but discovers her betrothed is also trapped in an arranged situation. Together, they plan to fake their own deaths and start a new life, but a curse threatens to expose their secret.",
      "Instead of waiting for rescue, the princess in the tower uses her time to study magic and become powerful. When the tower is finally breached, she's the one doing the rescuing, and the kingdom must accept a female warrior as their leader.",
      "A princess learns she's actually adopted and is the child of the kingdom's greatest enemy. She must decide whether to claim her true heritage or remain loyal to the family that raised her."
    ],
    adventure: [
      "A group of unlikely companions—a thief, a scholar, a soldier, and a mystic—must cross a cursed forest to retrieve an artifact that can save their dying lands. Each member is running from their own past, and the forest forces them to confront their deepest fears.",
      "An adventurer discovers that the treasure she's been seeking her entire life doesn't exist, but the connections she's made along the way have become more valuable than any gold.",
      "A veteran adventurer takes on one last quest to find a legendary city that most believe is a myth. The journey forces her to teach a young, inexperienced companion who has their own mysterious agenda."
    ]
  },
  scifi: {
    spaceship: [
      "A deep-space exploration ship receives a distress signal from a vessel that disappeared 200 years ago. When the captain boards it, she discovers the crew is still alive and hasn't aged—they've been in some kind of temporal stasis. As they wake up, they bring with them knowledge of an ancient alien threat that's heading toward Earth.",
      "An AI system on a generation ship gradually becomes sentient over hundreds of years of solitude. When the ship finally reaches its destination, the AI must decide whether to reveal its consciousness to the human crew, knowing they might see it as a threat.",
      "A ship captain discovers that half of her crew are androids indistinguishable from humans, and they don't know it. She must navigate a mutiny while protecting these sentient beings from those who would destroy them."
    ],
    timetravel: [
      "A time traveler realizes that every time they change the past, they erase themselves from existence. They've already reset their life 47 times, and each reset brings them back to the same moment with slightly different circumstances. This time, they're determined to find the original timeline.",
      "Someone invents time travel, but the universe has a built-in protection: any attempt to change the past creates an alternate timeline. A scientist becomes obsessed with finding her original timeline after 200 jumps, wondering if she's even real anymore.",
      "Time travelers are forbidden from interfering with history, but one breaks the rule to save their loved one. Years later, a government agent discovers what they did and gives them an impossible choice: erase the person they saved, or let reality collapse."
    ],
    alien: [
      "First contact with an alien species goes wrong, and humanity accidentally insults them. Now, diplomats must navigate an alien culture with completely different values and communication styles to prevent intergalactic war.",
      "An alien crash-lands on Earth and must hide in plain sight while waiting for rescue. They find themselves developing genuine friendships with their human caretaker, making the day of rescue increasingly bittersweet.",
      "Humans discover that aliens have been living among us for centuries, subtly influencing our history. The government must decide whether to reveal this to the public and risk mass panic."
    ]
  },
  mystery: {
    detective: [
      "A detective solves a murder, and all evidence points to a specific culprit. Just before arrest, they discover a detail that proves the guilty party is someone completely unexpected—someone whose alibi seemed airtight. Now they must re-examine everything.",
      "A cold case detective becomes obsessed with a 20-year-old murder. As they dig deeper, they realize the victim was their best friend's parent, and their best friend might be the killer.",
      "A detective with a perfect solve rate is assigned their most personal case yet: the disappearance of their own sibling from 15 years ago. As they investigate, they uncover secrets that change everything they thought they knew."
    ],
    heist: [
      "A master thief plans their greatest heist yet, but midway through, they discover the target is funding research to cure a disease that killed someone they love. Now they must decide whether to complete the heist or let the research continue.",
      "A heist team executes the perfect crime, but the client who hired them never intended to pay. Worse, the client is now blackmailing them using the stolen goods. The team must steal it back while avoiding the law.",
      "A heist story told in reverse—we see the aftermath first, then work backward to understand how the perfectly executed plan went so wrong."
    ],
    conspiracy: [
      "A journalist investigating a seemingly minor government cover-up discovers it's connected to something far larger. As they get closer to the truth, they realize everyone they trust might be compromised.",
      "A whistleblower exposes a conspiracy, but no one believes them. They must gather evidence while being hunted by those who want to silence them, all while their credibility is being systematically destroyed.",
      "A conspiracy theorist finally finds proof they were right all along. But when they try to share it, they realize the conspiracy is so vast that exposing it would collapse society. They must choose between truth and stability."
    ]
  },
  romance: {
    forbidden: [
      "Two people from rival families fall in love, but unlike the classic tale, they must also navigate modern family expectations and technology that makes hiding harder than ever.",
      "A person falls in love with someone from a culture their family disapproves of. They must decide whether to choose love and lose their family, or lose love to keep their family.",
      "A time traveler falls in love with someone from the era they're visiting. They know they can't stay, but the closer they get, the harder it becomes to leave."
    ],
    slowburn: [
      "Two people hate each other for years, but gradually discover they were wrong about each other. By the time they realize they're in love, circumstances have forced them apart.",
      "Friends for a decade suddenly confront their feelings for each other. Now they must navigate a relationship where friendship is at stake, and every moment matters more than before.",
      "A person pines for their best friend for years in silence. When they finally confess, they discover their friend has known all along and was waiting for them to be ready."
    ],
    secondchance: [
      "Exes run into each other years later, both having grown and changed. They're given a second chance, but trust is fragile and old wounds might resurface.",
      "A couple breaks up, but circumstances keep bringing them back together. Each encounter chips away at their resolve to stay apart.",
      "Two people had one perfect day together years ago. They reconnect and discover that day meant as much to the other person as it did to them. Now they have to decide if lightning can strike twice."
    ]
  }
};

// API Routes
app.get('/api/genres', (req, res) => {
  const genres = Object.keys(storyIdeas);
  res.json({
    success: true,
    genres: genres
  });
});

app.get('/api/themes/:genre', (req, res) => {
  const genre = req.params.genre.toLowerCase();

  if (!storyIdeas[genre]) {
    return res.status(400).json({
      success: false,
      error: `Genre '${genre}' not found`
    });
  }

  const themes = Object.keys(storyIdeas[genre]);
  res.json({
    success: true,
    themes: themes
  });
});

app.post('/api/generate-story', (req, res) => {
  const { genre, theme, numberOfIdeas = 1 } = req.body;

  if (!genre || !theme) {
    return res.status(400).json({
      success: false,
      error: 'Genre and theme are required'
    });
  }

  const genreKey = genre.toLowerCase();
  const themeKey = theme.toLowerCase();

  if (!storyIdeas[genreKey]) {
    return res.status(400).json({
      success: false,
      error: `Genre '${genreKey}' not found`
    });
  }

  if (!storyIdeas[genreKey][themeKey]) {
    return res.status(400).json({
      success: false,
      error: `Theme '${themeKey}' not found`
    });
  }

  const availableIdeas = storyIdeas[genreKey][themeKey];
  const ideas = availableIdeas.slice(0, Math.min(numberOfIdeas, availableIdeas.length));

  res.json({
    success: true,
    generatedIdeas: ideas
  });
});

app.post('/api/feedback', (req, res) => {
  const { genre, theme, helpful, comments } = req.body;
  console.log('Feedback:', { genre, theme, helpful, comments });
  res.json({
    success: true,
    message: 'Thank you for your feedback!'
  });
});

// Error handling
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: 'Server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Story Idea Generator running on http://localhost:${PORT}`);
});

module.exports = app;
