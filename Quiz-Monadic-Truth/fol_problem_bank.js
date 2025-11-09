// FOL Problem Bank with Checking Functions
// Each problem type includes formula template and checking logic

const PROBLEM_BANK = {
  stage0: [
    {
      id: "stage0_atomic_pos",
      formula_template: "P(c)",
      stage: 0,
      predicates: 1,
      constants: 1,
      description: "Atomic sentence with constant",
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        const constant = subs.c;
        return model[pred].includes(constant);
      }
    },
    {
      id: "stage0_atomic_neg",
      formula_template: "¬P(c)",
      stage: 0,
      predicates: 1,
      constants: 1,
      description: "Negated atomic sentence",
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        const constant = subs.c;
        return !model[pred].includes(constant);
      }
    },
    {
      id: "stage0_conjunction",
      formula_template: "P(c) ∧ Q(c)",
      stage: 0,
      predicates: 2,
      constants: 1,
      description: "Conjunction of two predicates",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const constant = subs.c;
        return model[pred1].includes(constant) && model[pred2].includes(constant);
      }
    },
    {
      id: "stage0_disjunction",
      formula_template: "P(c) ∨ Q(c)",
      stage: 0,
      predicates: 2,
      constants: 1,
      description: "Disjunction of two predicates",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const constant = subs.c;
        return model[pred1].includes(constant) || model[pred2].includes(constant);
      }
    },
    {
      id: "stage0_conditional",
      formula_template: "P(c) → Q(c)",
      stage: 0,
      predicates: 2,
      constants: 1,
      description: "Conditional with two predicates",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const constant = subs.c;
        return !model[pred1].includes(constant) || model[pred2].includes(constant);
      }
    },
    {
      id: "stage0_conditional_negated_consequent",
      formula_template: "P(c) → ¬Q(c)",
      stage: 0,
      predicates: 2,
      constants: 1,
      description: "Conditional with negated consequent",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const constant = subs.c;
        return !model[pred1].includes(constant) || !model[pred2].includes(constant);
      }
    },
    {
      id: "stage0_disjunction_with_three",
      formula_template: "P(c) ∨ (Q(c) ∨ R(c))",
      stage: 0,
      predicates: 3,
      constants: 1,
      description: "Nested disjunction with three predicates",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const pred3 = subs.R;
        const constant = subs.c;
        return model[pred1].includes(constant) || 
               model[pred2].includes(constant) || 
               model[pred3].includes(constant);
      }
    },
    {
      id: "stage0_disjunction_neg_first",
      formula_template: "¬P(c) ∨ Q(c)",
      stage: 0,
      predicates: 2,
      constants: 1,
      description: "Disjunction with negated first disjunct",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const constant = subs.c;
        return !model[pred1].includes(constant) || model[pred2].includes(constant);
      }
    },
    {
      id: "stage0_tautology",
      formula_template: "P(c) ∨ ¬P(c)",
      stage: 0,
      predicates: 1,
      constants: 1,
      description: "Tautology (law of excluded middle)",
      checkAnswer: (model, subs) => {
        return true; // Always true
      }
    }
  ],

  stage1: [
    {
      id: "stage1_simple_existential",
      formula_template: "∃xP(x)",
      stage: 1,
      predicates: 1,
      constants: 0,
      description: "Simple existential quantifier",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model[pred].length > 0;
      },
      checkWitness: (person, model, subs) => {
        const pred = subs.P;
        return model[pred].includes(person);
      }
    },
    {
      id: "stage1_existential_conjunction_2pred",
      formula_template: "∃x(P(x) ∧ Q(x))",
      stage: 1,
      predicates: 2,
      constants: 0,
      description: "Existential with conjunction of two predicates",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          model[pred1].includes(p) && model[pred2].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].includes(person) && model[pred2].includes(person);
      }
    },
    {
      id: "stage1_existential_conjunction_3pred",
      formula_template: "∃x(P(x) ∧ Q(x) ∧ R(x))",
      stage: 1,
      predicates: 3,
      constants: 0,
      description: "Existential with conjunction of three predicates",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const pred3 = subs.R;
        return model.domain.some(p => 
          model[pred1].includes(p) && 
          model[pred2].includes(p) && 
          model[pred3].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const pred3 = subs.R;
        return model[pred1].includes(person) && 
               model[pred2].includes(person) && 
               model[pred3].includes(person);
      }
    },
    {
      id: "stage1_existential_disjunction",
      formula_template: "∃x(P(x) ∨ Q(x))",
      stage: 1,
      predicates: 2,
      constants: 0,
      description: "Existential with disjunction",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          model[pred1].includes(p) || model[pred2].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].includes(person) || model[pred2].includes(person);
      }
    },
    {
      id: "stage1_existential_with_negation",
      formula_template: "∃x(P(x) ∧ ¬Q(x))",
      stage: 1,
      predicates: 2,
      constants: 0,
      description: "Existential with negated predicate",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          model[pred1].includes(p) && !model[pred2].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].includes(person) && !model[pred2].includes(person);
      }
    },
    {
      id: "stage1_existential_negated_first",
      formula_template: "∃x(¬P(x) ∧ Q(x))",
      stage: 1,
      predicates: 2,
      constants: 0,
      description: "Existential with negated first conjunct",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          !model[pred1].includes(p) && model[pred2].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return !model[pred1].includes(person) && model[pred2].includes(person);
      }
    },
    {
      id: "stage1_existential_negated_predicate",
      formula_template: "∃x¬P(x)",
      stage: 1,
      predicates: 1,
      constants: 0,
      description: "Existential quantifier with simple negation",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model.domain.some(p => !model[pred].includes(p));
      },
      checkWitness: (person, model, subs) => {
        const pred = subs.P;
        return !model[pred].includes(person);
      }
    },
    {
      id: "stage1_existential_conditional",
      formula_template: "∃x(P(x) → Q(x))",
      stage: 1,
      predicates: 2,
      constants: 0,
      description: "Existential with conditional (tricky - always true unless domain empty)",
      requires_witness: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          !model[pred1].includes(p) || model[pred2].includes(p)
        );
      },
      checkWitness: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return !model[pred1].includes(person) || model[pred2].includes(person);
      }
    }
  ],

  stage2: [
    {
      id: "stage2_simple_universal",
      formula_template: "∀xP(x)",
      stage: 2,
      predicates: 1,
      constants: 0,
      description: "Simple universal quantifier",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model.domain.every(p => model[pred].includes(p));
      },
      checkCounterexample: (person, model, subs) => {
        const pred = subs.P;
        return !model[pred].includes(person);
      }
    },
    {
      id: "stage2_universal_negation",
      formula_template: "∀x¬P(x)",
      stage: 2,
      predicates: 1,
      constants: 0,
      description: "Universal quantifier with negation",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model.domain.every(p => !model[pred].includes(p));
      },
      checkCounterexample: (person, model, subs) => {
        const pred = subs.P;
        return model[pred].includes(person);
      }
    },
    {
      id: "stage2_universal_conditional_2pred",
      formula_template: "∀x(P(x) → Q(x))",
      stage: 2,
      predicates: 2,
      constants: 0,
      description: "Universal conditional (standard form)",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => 
          !model[pred1].includes(p) || model[pred2].includes(p)
        );
      },
      checkCounterexample: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].includes(person) && !model[pred2].includes(person);
      }
    },
    {
      id: "stage2_universal_conditional_disjunction",
      formula_template: "∀x(P(x) → (Q(x) ∨ R(x)))",
      stage: 2,
      predicates: 3,
      constants: 0,
      description: "Universal conditional with disjunctive consequent",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const pred3 = subs.R;
        return model.domain.every(p => 
          !model[pred1].includes(p) || 
          model[pred2].includes(p) || 
          model[pred3].includes(p)
        );
      },
      checkCounterexample: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        const pred3 = subs.R;
        return model[pred1].includes(person) && 
               !model[pred2].includes(person) && 
               !model[pred3].includes(person);
      }
    },
    {
      id: "stage2_universal_disjunction",
      formula_template: "∀x(P(x) ∨ Q(x))",
      stage: 2,
      predicates: 2,
      constants: 0,
      description: "Universal quantifier with disjunction",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => 
          model[pred1].includes(p) || model[pred2].includes(p)
        );
      },
      checkCounterexample: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return !model[pred1].includes(person) && !model[pred2].includes(person);
      }
    },
    {
      id: "stage2_universal_conjunction",
      formula_template: "∀x(P(x) ∧ Q(x))",
      stage: 2,
      predicates: 2,
      constants: 0,
      description: "Universal quantifier with conjunction",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => 
          model[pred1].includes(p) && model[pred2].includes(p)
        );
      },
      checkCounterexample: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return !model[pred1].includes(person) || !model[pred2].includes(person);
      }
    },
    {
      id: "stage2_universal_biconditional",
      formula_template: "∀x(P(x) ↔ ¬Q(x))",
      stage: 2,
      predicates: 2,
      constants: 0,
      description: "Universal biconditional with negation",
      requires_counterexample: true,
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => 
          (model[pred1].includes(p) && !model[pred2].includes(p)) ||
          (!model[pred1].includes(p) && model[pred2].includes(p))
        );
      },
      checkCounterexample: (person, model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return (model[pred1].includes(person) && model[pred2].includes(person)) ||
               (!model[pred1].includes(person) && !model[pred2].includes(person));
      }
    },
    {
      id: "stage2_universal_tautology",
      formula_template: "∀x(P(x) ∨ ¬P(x))",
      stage: 2,
      predicates: 1,
      constants: 0,
      description: "Universal tautology (always true)",
      requires_counterexample: false,
      checkAnswer: (model, subs) => {
        return true; // Always true
      },
      checkCounterexample: (person, model, subs) => {
        return false; // No counterexample exists
      }
    }
  ],

  stage3: [
    {
      id: "stage3_separate_existentials",
      formula_template: "∃xP(x) ∧ ∃xQ(x)",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Two separate existential quantifiers (different witnesses allowed)",
      scope_note: "Different from ∃x(P(x) ∧ Q(x)) - allows different witnesses",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].length > 0 && model[pred2].length > 0;
      }
    },
    {
      id: "stage3_single_existential_conjunction",
      formula_template: "∃x(P(x) ∧ Q(x))",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Single existential with conjunction (same witness required)",
      scope_note: "Different from ∃xP(x) ∧ ∃xQ(x) - requires one witness for both",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.some(p => 
          model[pred1].includes(p) && model[pred2].includes(p)
        );
      }
    },
    {
      id: "stage3_separate_universals",
      formula_template: "∀xP(x) ∨ ∀xQ(x)",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Disjunction of two universal quantifiers",
      scope_note: "Different from ∀x(P(x) ∨ Q(x)) - requires all P or all Q",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => model[pred1].includes(p)) ||
               model.domain.every(p => model[pred2].includes(p));
      }
    },
    {
      id: "stage3_universal_disjunction",
      formula_template: "∀x(P(x) ∨ Q(x))",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Universal quantifier over disjunction",
      scope_note: "Different from ∀xP(x) ∨ ∀xQ(x) - each person can choose",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model.domain.every(p => 
          model[pred1].includes(p) || model[pred2].includes(p)
        );
      }
    },
    {
      id: "stage3_existential_implies_universal",
      formula_template: "∃xP(x) → ∀xQ(x)",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Existential as antecedent, universal as consequent",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return model[pred1].length === 0 || 
               model.domain.every(p => model[pred2].includes(p));
      }
    },
    {
      id: "stage3_universal_implies_existential",
      formula_template: "∀xP(x) → ∃xQ(x)",
      stage: 3,
      predicates: 2,
      constants: 0,
      description: "Universal as antecedent, existential as consequent",
      checkAnswer: (model, subs) => {
        const pred1 = subs.P;
        const pred2 = subs.Q;
        return !model.domain.every(p => model[pred1].includes(p)) ||
               model[pred2].length > 0;
      }
    },
    {
      id: "stage3_existential_and_negated_existential",
      formula_template: "∃xP(x) ∧ ∃x¬P(x)",
      stage: 3,
      predicates: 1,
      constants: 0,
      description: "Domain has both P and non-P",
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model[pred].length > 0 && 
               model.domain.some(p => !model[pred].includes(p));
      }
    },
    {
      id: "stage3_negated_existential",
      formula_template: "¬∃xP(x)",
      stage: 3,
      predicates: 1,
      constants: 0,
      description: "Negated existential (equivalent to ∀x¬P(x))",
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return model[pred].length === 0;
      }
    },
    {
      id: "stage3_negated_universal",
      formula_template: "¬∀xP(x)",
      stage: 3,
      predicates: 1,
      constants: 0,
      description: "Negated universal (equivalent to ∃x¬P(x))",
      checkAnswer: (model, subs) => {
        const pred = subs.P;
        return !model.domain.every(p => model[pred].includes(p));
      }
    }
  ]
};

// Helper function to get problems by stage
function getProblemsByStage(stage) {
  return PROBLEM_BANK[`stage${stage}`] || [];
}

// Helper function to get random problem from stage
function getRandomProblemFromStage(stage) {
  const problems = getProblemsByStage(stage);
  return problems[Math.floor(Math.random() * problems.length)];
}

// Helper function to get all problems
function getAllProblems() {
  return [
    ...PROBLEM_BANK.stage0,
    ...PROBLEM_BANK.stage1,
    ...PROBLEM_BANK.stage2,
    ...PROBLEM_BANK.stage3
  ];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROBLEM_BANK,
    getProblemsByStage,
    getRandomProblemFromStage,
    getAllProblems
  };
}
