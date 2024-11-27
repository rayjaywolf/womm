import { ChatGroq } from '@langchain/groq'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import z from 'zod'


const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what!:
- The overall mood
- The main subject
- Whether it contains negative emotions
- A brief summary
- A hex color representing the mood
- sentiment score

Return your analysis as a JSON object with the following structure:
{{
  "mood": one word "the mood of the person who wrote the journal entry.",
  "subject": "the subject of the journal entry.",
  "negative": boolean "is the journal entry negative? (i.e. does it contain negative emotions?).",
  "summary": "quick summary of the entire entry.",
  "color": "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
  "sentimentScore": number "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
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
