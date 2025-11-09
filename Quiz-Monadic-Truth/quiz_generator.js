// Quiz Generator for FOL Problems
// Generates quizzes with random models and sampled problems

// Available names for domain members
const AVAILABLE_NAMES = ['alice', 'bob', 'charlie', 'daisy', 'eddy'];

// Available predicate letters
const AVAILABLE_PREDICATES = ['P', 'Q', 'R', 'S', 'T'];

// Available constant letters (match what templates use)
const AVAILABLE_CONSTANTS = ['c', 'd', 'e', 'f', 'g'];

/**
 * Generate a random model
 * @param {number} domainSize - Size of domain (3-5)
 * @param {number} numPredicates - Number of predicates needed (1-3)
 * @returns {Object} Model with domain and predicate extensions
 */
function generateRandomModel(domainSize, numPredicates) {
  // Pick random domain size if not specified
  if (!domainSize) {
    domainSize = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
  }
  
  // Select domain members
  const domain = AVAILABLE_NAMES.slice(0, domainSize);
  
  // Create model object
  const model = {
    domain: domain,
    domainSize: domainSize
  };
  
  // Generate random extensions for each predicate
  const predicateLetters = AVAILABLE_PREDICATES.slice(0, numPredicates);
  
  predicateLetters.forEach(pred => {
    model[pred] = [];
    // Each domain member has 50% chance of being in extension
    domain.forEach(person => {
      if (Math.random() < 0.5) {
        model[pred].push(person);
      }
    });
  });
  
  return model;
}

/**
 * Generate constants for a model
 * @param {Object} model - The model
 * @param {number} numConstants - Number of constants needed
 * @returns {Object} Mapping from constant letters to domain members
 */
function generateConstants(model, numConstants) {
  const constants = {};
  const constantLetters = AVAILABLE_CONSTANTS.slice(0, numConstants);
  
  // Randomly assign constants to domain members
  constantLetters.forEach(c => {
    const randomPerson = model.domain[Math.floor(Math.random() * model.domain.length)];
    constants[c] = randomPerson;
  });
  
  return constants;
}

/**
 * Create substitutions for a problem template
 * @param {Object} problem - Problem from problem bank
 * @param {Object} model - Generated model
 * @param {Object} constants - Constant assignments
 * @returns {Object} Substitution mapping
 */
function createSubstitutions(problem, model, constants) {
  const subs = {};
  
  // Map predicate variables to actual predicates in model
  const predicateLetters = AVAILABLE_PREDICATES.slice(0, problem.predicates);
  predicateLetters.forEach((pred, index) => {
    // Map P to first predicate, Q to second, R to third, etc.
    const templateVar = String.fromCharCode(80 + index); // 'P', 'Q', 'R', ...
    subs[templateVar] = pred;
  });
  
  // Map constant variables to actual people
  // Templates use 'c', 'd', 'e' and we generate constants with same names
  if (problem.constants > 0) {
    const constantLetters = AVAILABLE_CONSTANTS.slice(0, problem.constants);
    constantLetters.forEach(c => {
      subs[c] = constants[c]; // e.g., subs['c'] = 'alice'
    });
  }
  
  return subs;
}

/**
 * Apply substitutions to formula template
 * @param {string} template - Formula template like "∃x(P(x) ∧ Q(x))"
 * @param {Object} subs - Substitution mapping
 * @returns {string} Instantiated formula
 */
function applySubstitutions(template, subs) {
  let formula = template;
  
  // Replace predicates (P, Q, R, S, T)
  Object.keys(subs).forEach(key => {
    if (key.match(/^[PQRST]$/)) {
      // Replace P(, Q(, R( etc. with actual predicate letters
      const regex = new RegExp(key + '\\(', 'g');
      formula = formula.replace(regex, subs[key] + '(');
    }
  });
  
  // DON'T replace constants in the formula!
  // The formula should show "P(c)" not "P(bob)"
  // The constant 'c' is defined in the model (e.g., "c: bob")
  
  return formula;
}

/**
 * Generate a complete quiz
 * @param {Object} options - Quiz generation options
 * @returns {Object} Complete quiz with model and problems
 */
function generateQuiz(options = {}) {
  const {
    stage0Count = 1,
    stage1Count = 2,
    stage2Count = 2,
    stage3Count = 2,
    domainSize = null // will be random if null
  } = options;
  
  // Determine maximum predicates needed across all problems
  const maxPredicates = 3; // Max we need from problem bank
  
  // Generate random model
  const model = generateRandomModel(domainSize, maxPredicates);
  
  // Generate constants (max needed is 1 from stage 0)
  const constants = generateConstants(model, 1);
  
  // Sample problems from each stage
  const selectedProblems = [];
  
  // Stage 0
  for (let i = 0; i < stage0Count; i++) {
    const problem = getRandomProblemFromStage(0);
    selectedProblems.push(problem);
  }
  
  // Stage 1
  for (let i = 0; i < stage1Count; i++) {
    const problem = getRandomProblemFromStage(1);
    selectedProblems.push(problem);
  }
  
  // Stage 2
  for (let i = 0; i < stage2Count; i++) {
    const problem = getRandomProblemFromStage(2);
    selectedProblems.push(problem);
  }
  
  // Stage 3
  for (let i = 0; i < stage3Count; i++) {
    const problem = getRandomProblemFromStage(3);
    selectedProblems.push(problem);
  }
  
  // Instantiate each problem with substitutions
  const instantiatedProblems = selectedProblems.map((problem, index) => {
    const subs = createSubstitutions(problem, model, constants);
    const formula = applySubstitutions(problem.formula_template, subs);
    
    return {
      number: index + 1,
      formula: formula,
      originalProblem: problem,
      substitutions: subs,
      stage: problem.stage,
      requiresWitness: problem.requires_witness || false,
      requiresCounterexample: problem.requires_counterexample || false
    };
  });
  
  return {
    model: model,
    constants: constants,
    problems: instantiatedProblems,
    metadata: {
      generatedAt: new Date().toISOString(),
      domainSize: model.domainSize,
      totalProblems: instantiatedProblems.length
    }
  };
}

/**
 * Check student answer for a problem
 * @param {Object} quiz - The quiz object
 * @param {number} problemNumber - Problem number (1-indexed)
 * @param {boolean} studentAnswer - Student's true/false answer
 * @param {string|null} witness - Student's witness (if applicable)
 * @returns {Object} Grading result
 */
function checkAnswer(quiz, problemNumber, studentAnswer, witness = null) {
  const problem = quiz.problems[problemNumber - 1];
  const model = quiz.model;
  const subs = problem.substitutions;
  
  // Check truth value
  const correctAnswer = problem.originalProblem.checkAnswer(model, subs);
  const truthValueCorrect = studentAnswer === correctAnswer;
  
  let witnessCorrect = true;
  let witnessRequired = false;
  let witnessMessage = '';
  
  // Check witness/counterexample if applicable
  if (problem.requiresWitness && correctAnswer === true) {
    witnessRequired = true;
    if (!witness || witness === 'n/a') {
      witnessCorrect = false;
      witnessMessage = 'A witness is required for this true existential claim.';
    } else if (!model.domain.includes(witness)) {
      witnessCorrect = false;
      witnessMessage = `"${witness}" is not in the domain.`;
    } else {
      witnessCorrect = problem.originalProblem.checkWitness(witness, model, subs);
      if (!witnessCorrect) {
        witnessMessage = `"${witness}" is not a valid witness.`;
      }
    }
  } else if (problem.requiresCounterexample && correctAnswer === false) {
    witnessRequired = true;
    if (!witness || witness === 'n/a') {
      witnessCorrect = false;
      witnessMessage = 'A counterexample is required for this false universal claim.';
    } else if (!model.domain.includes(witness)) {
      witnessCorrect = false;
      witnessMessage = `"${witness}" is not in the domain.`;
    } else {
      witnessCorrect = problem.originalProblem.checkCounterexample(witness, model, subs);
      if (!witnessCorrect) {
        witnessMessage = `"${witness}" is not a valid counterexample.`;
      }
    }
  } else {
    // Witness not required - accept n/a or blank
    witnessRequired = false;
  }
  
  const isCorrect = truthValueCorrect && witnessCorrect;
  
  return {
    correct: isCorrect,
    truthValueCorrect: truthValueCorrect,
    witnessCorrect: witnessCorrect,
    witnessRequired: witnessRequired,
    correctAnswer: correctAnswer,
    witnessMessage: witnessMessage,
    problem: problem
  };
}

/**
 * Grade entire quiz
 * @param {Object} quiz - The quiz object
 * @param {Array} studentAnswers - Array of {truthValue, witness} objects
 * @returns {Object} Grading results
 */
function gradeQuiz(quiz, studentAnswers) {
  const results = studentAnswers.map((answer, index) => {
    return checkAnswer(quiz, index + 1, answer.truthValue, answer.witness);
  });
  
  const totalProblems = results.length;
  const correctProblems = results.filter(r => r.correct).length;
  const score = correctProblems / totalProblems;
  
  return {
    results: results,
    totalProblems: totalProblems,
    correctProblems: correctProblems,
    score: score,
    percentage: Math.round(score * 100)
  };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateRandomModel,
    generateConstants,
    createSubstitutions,
    applySubstitutions,
    generateQuiz,
    checkAnswer,
    gradeQuiz
  };
}
