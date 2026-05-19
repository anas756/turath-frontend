# Step A: Choose the operating system & language engine
FROM node:20-alpine

# Step B: Set the working folder inside the container house
WORKDIR /app

# Step C: Copy the "shopping list" of npm packages first
COPY package*.json ./

# Step D: Install the React dependencies inside the container
RUN npm install

# Step E: Copy the rest of the frontend source code files
COPY . .

# Step F: Expose port 3000 (where Vite/React usually runs)
EXPOSE 3000

# Step G: Turn on the live React development server
CMD ["npm", "run", "dev", "--", "--host"]