import { ChatGroq } from '@langchain/groq'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import z from 'zod'


const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what!:
- The overall mood (MUST CHOOSE ONLY ONE FROM THIS LIST AND USE THE CORRESPONDING COLOR, - Choose ONE mood from the provided list below
- You MUST select a specific mood from the list, not a general category
- Avoid defaulting to common moods - consider the full range of options equally
- Your selection should be based on the most precise match to the entry's content
- Each mood should have an equal probability of being selected if it matches the content):
  Happy:#FFD700, Sad:#0000FF, Excited:#FF4500, Nervous:#D3D3D3, Angry:#FF0000, 
  Grateful:#32CD32, Confused:#8A2BE2, Relaxed:#ADD8E6, Stressed:#800080, Hopeful:#90EE90, 
  Anxious:#FFFF00, Bored:#BEBEBE, Content:#98FB98, Energized:#FF6347, Frustrated:#FF8C00, 
  Overwhelmed:#B22222, Calm:#A3D9FF, Lonely:#708090, Curious:#FFD700, Tired:#696969, 
  Inspired:#FF1493, Disappointed:#808080, Joyful:#FF69B4, Restless:#FF6347, Focused:#2E8B57, 
  Embarrassed:#FFB6C1, Annoyed:#FF4500, Peaceful:#98FB98, Nostalgic:#FFD700, Determined:#228B22, 
  Scared:#FF0000, Optimistic:#32CD32, Pessimistic:#808080, Confident:#000080, Jealous:#006400, 
  Giddy:#FF69B4, Melancholy:#4B0082, Grumpy:#B22222, Surprised:#FFFF00, Appreciative:#32CD32, 
  Indifferent:#A9A9A9, Reflective:#C0C0C0, Playful:#FF4500, Regretful:#800000, Resentful:#8B0000, 
  Loving:#FF1493, Misunderstood:#6A5ACD, Shocked:#FFD700, Satisfied:#98FB98, Vulnerable:#F08080, 
  Empowered:#228B22, Detached:#A9A9A9, Motivated:#32CD32, Scattered:#D3D3D3, Relieved:#90EE90, 
  Enthusiastic:#FF6347, Suspicious:#A52A2A, Tender:#FFC0CB, Irritated:#FF8C00, Creative:#8A2BE2, 
  Hesitant:#D3D3D3, Bold:#FF4500, Cheerful:#FFFF00, Thoughtful:#C0C0C0, Impatient:#FF6347, 
  Panicked:#FF0000, Insecure:#808080, Surly:#8B0000, Cautious:#A9A9A9, Defeated:#B22222, 
  Victorious:#FFD700, Rebellious:#800080, Silly:#FF1493, Heartbroken:#800000, Mellow:#D3D3D3, 
  Jubilant:#FFFF00, Wistful:#8A2BE2, Clueless:#C0C0C0, Inquisitive:#FFD700, Defensive:#A52A2A, 
  Trusting:#32CD32, Distrustful:#B22222, Passionate:#FF1493, Conflicted:#8B0000, Lonely:#708090, 
  Hyped:#FF6347, Guilty:#A52A2A, Smug:#800080, Disgusted:#8B0000, Eager:#FFD700, Ashamed:#800000, 
  Resilient:#228B22, Envious:#006400, Daring:#FF4500, Fearful:#FF0000, Unsettled:#A9A9A9, 
  Empowered:#228B22, Ambitious:#32CD32, Awestruck:#D2691E, Zen:#98FB98

Return your analysis as a JSON object with the following structure:
{{
  "mood": "MUST choose only one mood from the provided list above",
  "subject": "the subject of the journal entry.",
  "negative": boolean "is the journal entry negative? (i.e. does it contain negative emotions?).",
  "summary": "quick summary of the entire entry.",
  "color": "MUST use the exact hex color that corresponds to the chosen mood from the list above",
  "sentimentScore": number "sentiment of the text rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
}}`,
  ],
  ['user', '{entry}'],
])

export const analyze = async (content: string) => {
  const model = new ChatGroq({
    model: 'gemma2-9b-it',
    temperature: 0,
  })

  const chain = prompt
    .pipe(model)
    .pipe(new JsonOutputParser<z.infer<typeof analysis>>())

  try {
    const result = await chain.invoke({
      entry: content,
    })
    console.log(result)

    return result
  } catch (error) {
    console.error('Failed to analyze entry:', error)
    throw error
  }
}
