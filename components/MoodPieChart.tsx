'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const moodCategories = {
    happiness: {
        moods: ['Happy', 'Grateful', 'Content', 'Joyful', 'Optimistic', 'Giddy', 'Appreciative', 'Satisfied', 'Cheerful', 'Victorious', 'Silly', 'Jubilant', 'Trusting', 'Eager', 'Confident', 'Loving', 'Playful', 'Motivated', 'Enthusiastic', 'Empowered', 'Ambitious', 'Bold', 'Resilient', 'Tender', 'Zen'],
        color: '#F9DD7E'
    },
    sadness: {
        moods: ['Sad', 'Disappointed', 'Melancholy', 'Regretful', 'Heartbroken', 'Wistful', 'Lonely', 'Defeated', 'Ashamed', 'Vulnerable', 'Guilty', 'Insecure', 'Detached', 'Misunderstood', 'Pessimistic', 'Surly', 'Conflicted'],
        color: '#EEDAD1'
    },
    calmness: {
        moods: ['Relaxed', 'Calm', 'Peaceful', 'Mellow', 'Thoughtful', 'Reflective', 'Creative', 'Focused', 'Relieved', 'Cautious', 'Awestruck', 'Inquisitive', 'Curious', 'Indifferent'],
        color: '#8D9868'
    },
    anger: {
        moods: ['Angry', 'Annoyed', 'Grumpy', 'Resentful', 'Irritated', 'Distrustful', 'Disgusted', 'Rebellious', 'Defensive', 'Smug', 'Frustrated', 'Impatient', 'Envious'],
        color: '#E1927F'
    },
    excitement: {
        moods: ['Excited', 'Energized', 'Inspired', 'Restless', 'Surprised', 'Shocked', 'Hyped', 'Daring', 'Passionate', 'Bold', 'Determined', 'Nostalgic', 'Eager', 'Enthusiastic'],
        color: '#7DA3DA'
    },
    stress: {
        moods: ['Nervous', 'Stressed', 'Anxious', 'Overwhelmed', 'Scared', 'Jealous', 'Scattered', 'Hesitant', 'Panicked', 'Unsettled', 'Embarrassed', 'Suspicious', 'Fearful', 'Clueless', 'Confused', 'Tired', 'Bored'],
        color: '#A6ACDB'
    }
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="hsl(var(--foreground))"
            className="text-xs font-medium"
            textAnchor="middle"
            dominantBaseline="middle"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <Card className="border-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: payload[0].payload.color }}
                    />
                    <CardTitle className="text-sm font-medium">
                        {payload[0].name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                    {`${payload[0].value} entries (${((payload[0].value / payload[0].payload.total) * 100).toFixed(0)}%)`}
                </CardContent>
            </Card>
        )
    }
    return null
}

const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
            {payload.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: entry.color }}
                    />
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

const MoodPieChart = ({ data }) => {
    const getMoodCategory = (mood) => {
        for (const [category, info] of Object.entries(moodCategories)) {
            if (info.moods.includes(mood)) {
                return category
            }
        }
        return 'unknown'
    }

    const categoryData = data.reduce((acc, entry) => {
        const category = getMoodCategory(entry.mood)
        acc[category] = (acc[category] || 0) + 1
        return acc
    }, {})

    const total = Object.values(categoryData).reduce((sum, value) => sum + value, 0)

    const chartData = Object.entries(categoryData)
        .filter(([name]) => name !== 'unknown')
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: moodCategories[name]?.color,
            total
        }))

    return (
        <div className="col-span-4">
            <div>
                <h2 className="text-lg font-semibold tracking-tight mb-3">
                    Mood Categories Distribution
                </h2>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={80}
                            outerRadius={150}
                            paddingAngle={2}
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="stroke-background stroke-2"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default MoodPieChart