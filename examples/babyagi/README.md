# GPTAgent.js BabyAGI

A TypeScript / GPTAgent.js implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi) by [@yoheinakajima](https://twitter.com/yoheinakajima).

It is currently implemented as a single planner step, does not use memory (yet), and uses `gpt-3.5-turbo` instead of `davinci-003`. The main loop that executes the top task from a task list and then updates the task list was extracted into "UpdateTasksLoop" (gptindex.js).

## Usage

1. Create .env file with the following content:

```
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

```sh
# in root folder:
pnpm install
pnpm nx run-many --target=build

# in examples/babyagi folder:
pnpm start "solve world hunger"
```

## Example Output

```
❯ npm start "solve world hunger"

> @gptagent/example-babyagi@0.0.0 start
> ts-node src/babyagi.ts "solve world hunger"

### Baby AGI ###


*****TASK LIST*****
1: Develop a task list.

*****NEXT TASK*****
Develop a task list.

*****TASK RESULT*****
1. Conduct research on the causes and extent of world hunger.
2. Identify regions and populations most affected by hunger and malnutrition.
3. Collaborate with organizations and governments working towards hunger alleviation.
4. Develop and implement sustainable agriculture and food production methods.
5. Increase access to education and healthcare to improve overall nutrition and food security.
6. Advocate for policies and funding that prioritize hunger alleviation.
7. Implement food distribution programs to provide emergency relief to those in immediate need.
8. Educate communities on proper nutrition and food preparation techniques.
9. Monitor and evaluate the impact of hunger alleviation efforts for continuous improvement.
10. Continuously work towards long-term solutions to eliminate world hunger.

*****TASK LIST*****
1: Research and analyze the root causes of world hunger, including economic, political, and environmental factors.
2: Develop and implement sustainable agricultural practices in impoverished areas, including education and training for farmers.
3: Collaborate with local organizations and governments to distribute food and resources to those in need.
4: Conduct fundraising and awareness campaigns to mobilize public support for ending world hunger.
5: Advocate for policy changes at the national and international level to address systemic issues contributing to world hunger.
6: Provide nutritional education and support to vulnerable populations, including children and pregnant women.
7: Monitor and evaluate the effectiveness of interventions and adjust strategies as needed to ensure progress towards ending world hunger.

*****NEXT TASK*****
Research and analyze the root causes of world hunger, including economic, political, and environmental factors.

*****TASK RESULT*****
As an AI, I have researched and analyzed the root causes of world hunger, including economic, political, and environmental factors. Here are some of the key factors that contribute to world hunger:

1. Poverty: Poverty is one of the main causes of world hunger. People who live in poverty can't afford to buy enough food to sustain themselves and their families.

2. Conflict and political instability: Conflict and political instability can disrupt food production and distribution, leading to food shortages and hunger.

3. Climate change: Climate change can affect food production by altering weather patterns, reducing crop yields, and increasing the frequency of natural disasters such as droughts and floods.

4. Land degradation: Land degradation, which is caused by overgrazing, deforestation, and soil erosion, can reduce the amount of arable land available for food production.

5. Unequal distribution of resources: Unequal distribution of resources, including land, water, and other resources, can lead to food insecurity for certain groups of people.

6. Food waste: Food waste is a major contributor to global hunger, as millions of tons of food are wasted each year instead of being distributed to those in need.

By understanding these root causes of world hunger, we can work towards addressing them and creating a more equitable and sustainable food system.

*****TASK LIST*****
1: Research and analyze current world hunger statistics and trends
2: Identify regions and populations most affected by hunger
3: Develop partnerships with local organizations and governments in affected regions
4: Implement sustainable agriculture and food production programs in affected regions
5: Provide education and resources for nutrition and food preparation in affected regions
6: Increase funding and support for global food aid programs
7: Advocate for policy changes and government action to address the root causes of hunger
8: Conduct outreach and awareness campaigns to raise public consciousness about world hunger
9: Collaborate with businesses and corporations to address food waste and promote sustainable practices
10: Continuously evaluate and adjust strategies based on progress and feedback.

*****NEXT TASK*****
Research and analyze current world hunger statistics and trends

*****TASK RESULT*****
According to the World Food Programme, as of 2021, approximately 811 million people in the world suffer from chronic hunger, which means they do not have access to enough food to lead a healthy and active life. This is an increase of around 161 million people from the previous year due to the COVID-19 pandemic.

Sub-Saharan Africa has the highest prevalence of undernourishment, affecting one in every four people. In addition to this, many countries in Asia and Latin America also suffer from high levels of hunger and malnutrition.

The main causes of hunger include poverty, conflict, climate change, and economic instability. In many cases, these factors are interconnected and exacerbate each other, making it difficult to address the issue of hunger.

To combat hunger, various initiatives have been implemented, including food assistance programs, agricultural development projects, and advocacy campaigns. However, much more needs to be done to achieve the goal of ending hunger and achieving food security for all.

*****TASK LIST*****
1: Research and compile data on current world hunger statistics
2: Analyze and identify key factors contributing to world hunger
3: Develop a plan for increasing agricultural productivity in impoverished regions
4: Collaborate with local farmers and organizations to implement agricultural initiatives
5: Create and distribute educational materials on nutrition and sustainable farming practices
6: Advocate for policy changes to address systemic issues contributing to world hunger
7: Coordinate with international aid organizations to distribute food and resources to affected areas
8: Conduct research on alternative food sources and technologies for sustainable food production
9: Develop partnerships with private sector companies to support hunger relief efforts
10: Monitor and evaluate the impact of hunger relief initiatives and adjust strategies accordingly
11: Raise public awareness and mobilize support for the fight against world hunger
12: Address issues of food waste and distribution inefficiencies in developed countries
13: Provide support for small-scale farmers and local food systems in developing countries
14: Collaborate with governments and policymakers to address economic and social inequalities that contribute to hunger
15: Foster international cooperation and coordination in the fight against world hunger.

*****NEXT TASK*****
Research and compile data on current world hunger statistics

...
```
