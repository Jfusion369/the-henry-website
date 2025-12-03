/**
 * Visual Security Question System
 * Generates image-based security challenges with click-based verification
 */

// Question bank - Various visual security challenges
const VISUAL_QUESTIONS = [
  {
    type: 'count_circles',
    question: 'How many circles are in this image?',
    hint: 'Count the round colored shapes',
    generateImage: generateShapeCountImage,
    validateAnswer: validateNumberAnswer
  },
  {
    type: 'dominant_color',
    question: 'What color appears most frequently?',
    hint: 'Look for the dominant color in the pattern',
    generateImage: generateColorPatternImage,
    validateAnswer: validateColorAnswer
  },
  {
    type: 'spot_difference',
    question: 'How many differences between the two patterns?',
    hint: 'Compare left and right sides',
    generateImage: generateSpotDifferenceImage,
    validateAnswer: validateNumberAnswer
  },
  {
    type: 'count_stars',
    question: 'Count the number of stars in the pattern',
    hint: 'Count all visible gold/yellow stars',
    generateImage: generateStarPatternImage,
    validateAnswer: validateNumberAnswer
  },
  {
    type: 'rarest_shape',
    question: 'Which shape appears the least?',
    hint: 'Identify the rarest shape (circle, square, or triangle)',
    generateImage: generateMixedShapesImage,
    validateAnswer: validateShapeAnswer
  }
];

/**
 * Generate SVG for counting circles
 */
function generateShapeCountImage() {
  const circleCount = Math.floor(Math.random() * 5) + 3;
  const positions = [];
  let svg = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="white"/>';
  
  // Add grid
  for (let i = 0; i < 300; i += 40) {
    svg += `<line x1="${i}" y1="0" x2="${i}" y2="200" stroke="#e0e0e0" stroke-width="1"/>`;
  }
  for (let i = 0; i < 200; i += 40) {
    svg += `<line x1="0" y1="${i}" x2="300" y2="${i}" stroke="#e0e0e0" stroke-width="1"/>`;
  }
  
  // Generate circles
  for (let i = 0; i < circleCount; i++) {
    let x, y, valid;
    do {
      valid = true;
      x = Math.random() * (300 - 80) + 40;
      y = Math.random() * (200 - 80) + 40;
      
      for (let pos of positions) {
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist < 80) {
          valid = false;
          break;
        }
      }
    } while (!valid);
    
    positions.push({ x, y });
    const hue = Math.random() * 360;
    svg += `<circle cx="${x}" cy="${y}" r="30" fill="hsl(${hue}, 70%, 60%)" stroke="#333" stroke-width="2"/>`;
  }
  
  svg += '</svg>';
  return { svg, answer: circleCount.toString(), type: 'circle_count' };
}

/**
 * Generate SVG for color pattern
 */
function generateColorPatternImage() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
  const dominantColor = colors[Math.floor(Math.random() * colors.length)];
  
  let svg = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="white"/>';
  
  const cellSize = 40;
  for (let y = 0; y < 200; y += cellSize) {
    for (let x = 0; x < 300; x += cellSize) {
      const isDomin = Math.random() < 0.6;
      const selectedColor = isDomin ? dominantColor : colors[Math.floor(Math.random() * colors.length)];
      svg += `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${selectedColor}"/>`;
    }
  }
  
  svg += '<rect width="300" height="200" fill="none" stroke="#999" stroke-width="2"/></svg>';
  return { svg, answer: dominantColor, type: 'dominant_color' };
}

/**
 * Generate SVG for spot the difference
 */
function generateSpotDifferenceImage() {
  let svg = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="white"/>';
  
  const mid = 150;
  
  // Left side
  svg += '<rect x="20" y="40" width="80" height="80" fill="#3498db"/>';
  svg += '<circle cx="150" cy="80" r="30" fill="#e74c3c"/>';
  
  // Right side (different)
  svg += '<rect x="' + (mid + 20) + '" y="40" width="80" height="80" fill="#3498db"/>';
  svg += '<circle cx="' + (mid + 150) + '" cy="80" r="30" fill="#f39c12"/>';
  
  // Random differences
  const diffCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < diffCount; i++) {
    const x = Math.random() * (mid - 40) + 20;
    const y = Math.random() * 100 + 150;
    svg += `<circle cx="${x}" cy="${y}" r="10" fill="#2ecc71"/>`;
  }
  
  svg += '</svg>';
  return { svg, answer: (diffCount + 1).toString(), type: 'spot_difference' };
}

/**
 * Generate SVG for star pattern
 */
function generateStarPatternImage() {
  let svg = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="white"/>';
  
  const starCount = Math.floor(Math.random() * 6) + 4;
  
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * (300 - 40) + 20;
    const y = Math.random() * (200 - 40) + 20;
    svg += generateStarPath(x, y);
  }
  
  svg += '</svg>';
  return { svg, answer: starCount.toString(), type: 'star_count' };
}

/**
 * Generate SVG star path
 */
function generateStarPath(cx, cy) {
  const spikes = 5;
  const outerRadius = 15;
  const innerRadius = 10;
  
  let points = [];
  let rot = -Math.PI / 2;
  let step = Math.PI / spikes;
  
  for (let i = 0; i < spikes; i++) {
    points.push([cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius]);
    rot += step;
    points.push([cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius]);
    rot += step;
  }
  
  const pointsStr = points.map(p => p.join(',')).join(' ');
  return `<polygon points="${pointsStr}" fill="#FFD700" stroke="#FF8C00" stroke-width="2"/>`;
}

/**
 * Generate SVG for mixed shapes
 */
function generateMixedShapesImage() {
  let svg = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" fill="white"/>';
  
  const shapeCount = {
    circle: Math.floor(Math.random() * 4) + 3,
    square: Math.floor(Math.random() * 4) + 3,
    triangle: Math.floor(Math.random() * 3) + 1
  };
  
  // Draw circles
  for (let i = 0; i < shapeCount.circle; i++) {
    const x = Math.random() * (300 - 40) + 20;
    const y = Math.random() * (200 - 40) + 20;
    svg += `<circle cx="${x}" cy="${y}" r="15" fill="#3498db"/>`;
  }
  
  // Draw squares
  for (let i = 0; i < shapeCount.square; i++) {
    const x = Math.random() * (300 - 40) + 20;
    const y = Math.random() * (200 - 40) + 20;
    svg += `<rect x="${x}" y="${y}" width="30" height="30" fill="#e74c3c"/>`;
  }
  
  // Draw triangles
  for (let i = 0; i < shapeCount.triangle; i++) {
    const x = Math.random() * (300 - 40) + 20;
    const y = Math.random() * (200 - 40) + 20;
    const points = `${x},${y - 20} ${x - 20},${y + 20} ${x + 20},${y + 20}`;
    svg += `<polygon points="${points}" fill="#2ecc71"/>`;
  }
  
  svg += '</svg>';
  
  const rarest = Math.min(shapeCount.circle, shapeCount.square, shapeCount.triangle);
  let rariestShape = '';
  if (shapeCount.triangle === rarest) rariestShape = 'triangle';
  else if (shapeCount.square === rarest) rariestShape = 'square';
  else rariestShape = 'circle';
  
  return { svg, answer: rariestShape, type: 'shape_identify' };
}

/**
 * Validate numeric answer
 */
function validateNumberAnswer(userAnswer, correctAnswer) {
  return parseInt(userAnswer) === parseInt(correctAnswer);
}

/**
 * Validate color answer
 */
function validateColorAnswer(userAnswer, correctAnswer) {
  return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
}

/**
 * Validate shape answer
 */
function validateShapeAnswer(userAnswer, correctAnswer) {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
}

/**
 * Generate a new visual security question
 */
function generateVisualQuestion() {
  const questionData = VISUAL_QUESTIONS[Math.floor(Math.random() * VISUAL_QUESTIONS.length)];
  const sessionId = generateSessionId();
  
  // Generate the SVG image
  const imageData = questionData.generateImage();
  
  // Store session
  const session = {
    type: questionData.type,
    question: questionData.question,
    hint: questionData.hint,
    answer: imageData.answer,
    timestamp: Date.now(),
    attempts: 0,
    verified: false,
    validateFn: questionData.validateAnswer
  };
  
  visualQuestionSessions.set(sessionId, session);
  
  console.log(`🖼️ Visual question generated: ${sessionId} (${questionData.type})`);
  
  return {
    sessionId,
    question: questionData.question,
    hint: questionData.hint,
    type: questionData.type,
    imageSvg: imageData.svg
  };
}

/**
 * Verify a visual question answer
 */
function verifyVisualAnswer(sessionId, userAnswer) {
  const session = visualQuestionSessions.get(sessionId);
  
  if (!session) {
    return {
      success: false,
      message: 'Visual question not found or expired',
      verified: false
    };
  }
  
  // Check expiry
  if (Date.now() - session.timestamp > VISUAL_CONFIG.EXPIRY) {
    visualQuestionSessions.delete(sessionId);
    return {
      success: false,
      message: 'Visual question expired. Please get a new one.',
      verified: false
    };
  }
  
  // Check attempt limit
  if (session.attempts >= VISUAL_CONFIG.MAX_ATTEMPTS) {
    visualQuestionSessions.delete(sessionId);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please get a new visual question.',
      verified: false
    };
  }
  
  // Validate answer
  if (session.validateFn(userAnswer, session.answer)) {
    session.verified = true;
    console.log(`✅ Visual question verified: ${sessionId}`);
    return {
      success: true,
      message: 'Correct! Security verification passed.',
      verified: true
    };
  } else {
    session.attempts++;
    const remaining = VISUAL_CONFIG.MAX_ATTEMPTS - session.attempts;
    console.log(`❌ Wrong answer: ${sessionId} (attempt ${session.attempts}/${VISUAL_CONFIG.MAX_ATTEMPTS})`);
    
    return {
      success: false,
      message: `Incorrect answer. ${remaining} attempts remaining.`,
      verified: false,
      attemptsRemaining: remaining
    };
  }
}

/**
 * In-memory storage
 */
const visualQuestionSessions = new Map();
const captchaSessions = new Map();
const rateLimitStore = new Map();

/**
 * Configuration
 */
const VISUAL_CONFIG = {
  EXPIRY: 10 * 60 * 1000,           // 10 minutes
  MAX_ATTEMPTS: 5,                   // Wrong answers before reset
  RATE_LIMIT_WINDOW: 60 * 60 * 1000 // 1 hour
};

/**
 * Generate session ID
 */
function generateSessionId() {
  return 'visual_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

/**
 * Check if verified
 */
function isVisualQuestionVerified(sessionId) {
  const session = visualQuestionSessions.get(sessionId);
  
  if (!session) return false;
  if (Date.now() - session.timestamp > VISUAL_CONFIG.EXPIRY) {
    visualQuestionSessions.delete(sessionId);
    return false;
  }
  
  return session.verified === true;
}

/**
 * Cleanup expired questions
 */
function cleanupExpiredVisualQuestions() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [id, session] of visualQuestionSessions.entries()) {
    if (now - session.timestamp > VISUAL_CONFIG.EXPIRY) {
      visualQuestionSessions.delete(id);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired visual questions`);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupExpiredVisualQuestions, 30 * 60 * 1000);
cleanupExpiredVisualQuestions();

module.exports = {
  generateVisualQuestion,
  verifyVisualAnswer,
  isVisualQuestionVerified,
  VISUAL_CONFIG
};
