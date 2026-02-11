export const generateNotesPrompt = (transcript, metadata = {}) => {
    const { subject, duration, lectureTitle } = metadata;

    return `You are an expert study assistant helping a university student.

CONTEXT:
- Lecture: ${lectureTitle || 'Unknown'}
- Subject: ${subject || 'General'}
- Duration: ${duration ? `${Math.floor(duration / 60)} minutes` : 'Unknown'}

TRANSCRIPT:
${transcript}

TASK: Create structured notes with these EXACT sections:

# 📋 EXECUTIVE SUMMARY
[2-3 sentences overview]

# 🎯 KEY CONCEPTS
[Number each (1-10 max). Include:
- Concept name in bold
- 2-3 sentence explanation
- Real-world example
- Connections to other concepts]

# 📐 FORMULAS & EQUATIONS
[If applicable, list with:
- Formula in proper notation
- Variable definitions
- When/how to apply]

# 📖 DEFINITIONS & TERMINOLOGY
[Alphabetically ordered with clear definitions]

# ❓ PRACTICE QUESTIONS
[10 questions:
- 3 Basic (recall/understanding)
- 4 Intermediate (application/analysis)
- 3 Advanced (synthesis/evaluation)
Include question type: Multiple Choice, Short Answer, or Essay]

# ⚡ QUICK REVIEW POINTS
[5-7 essential bullet points for exam prep]

# 💡 STUDY TIPS
[2-3 specific tips including:
- Recommended study methods
- Common pitfalls
- Prerequisite connections]

GUIDELINES:
- Use clear, student-friendly language
- Include examples everywhere possible
- Highlight connections between concepts
- Flag anything "important" or "will be on exam"
- Mark unclear sections with [UNCLEAR]`;
};
