const axios = require("axios")

const testBackend = async () => {
  try {
    console.log("🔍 Testing backend connectivity...")

    // Test basic connection
    const healthResponse = await axios.get("http://localhost:5000/api/health")
    console.log("✅ Health check:", healthResponse.data)

    // Test questions endpoint
    const questionsResponse = await axios.get("http://localhost:5000/api/questions/test")
    console.log("✅ Questions router:", questionsResponse.data)

    // Test domains endpoint
    const domainsResponse = await axios.get("http://localhost:5000/api/questions/domains")
    console.log("✅ Available domains:", domainsResponse.data)

    // Test random questions
    const randomResponse = await axios.get("http://localhost:5000/api/questions/random/Mathematics?count=2")
    console.log("✅ Random questions:", `Found ${randomResponse.data.length} questions`)

    console.log("\n🎉 All backend tests passed!")
  } catch (error) {
    console.error("❌ Backend test failed:")
    if (error.response) {
      console.error("Status:", error.response.status)
      console.error("Data:", error.response.data)
    } else if (error.request) {
      console.error("No response received. Is the backend running on port 5000?")
    } else {
      console.error("Error:", error.message)
    }
    console.log("\n💡 Make sure to run 'npm run server' in another terminal")
  }
}

testBackend()
