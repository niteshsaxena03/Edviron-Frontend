import { seedTransactions, login } from "./seedTransactions.js";

// Number of transactions to create
const COUNT = 10;

// Change these credentials to match your system
const EMAIL = "nitesh04@gmail.com";
const PASSWORD = "11111111";

async function runSeeder() {
  console.log(`Attempting to login as ${EMAIL}...`);

  try {
    const token = await login(EMAIL, PASSWORD);

    if (!token) {
      console.error("Login failed. Check your credentials.");
      return;
    }

    console.log("Login successful. Starting to create transactions...");

    const result = await seedTransactions(COUNT, token);

    if (result.success) {
      console.log(
        `Created ${result.results.created} transactions successfully.`
      );
      console.log(`Simulated ${result.results.callbacks} callbacks.`);

      if (result.results.errors > 0) {
        console.warn(
          `There were ${result.results.errors} errors during the process.`
        );
      }
    } else {
      console.error("Failed to seed transactions:", result.message);
    }
  } catch (error) {
    console.error("Error running seeder:", error);
  }
}

// Run the seeder
runSeeder();
