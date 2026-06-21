// ═══════════════════════════════════════════════════
// ECOTRACK AI — OFFLINE CHATBOT & INSIGHTS ENGINE
// ═══════════════════════════════════════════════════

/**
 * Fallback static recommendations for the Dashboard
 */
export async function getRecommendations(activities) {
  // Simulate network delay for UI consistency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!activities || activities.length === 0) {
    return "Welcome to EcoTrack AI! 🌱 Start logging your daily activities (like your commute, meals, or electricity usage) and I'll analyze them to give you personalized tips on reducing your carbon footprint. Every small step helps!";
  }

  // Simple rule-based recommendations based on activity history
  const hasTransport = activities.some(a => a.category === 'transport' && a.type === 'car');
  const hasFood = activities.some(a => a.category === 'food' && (a.type === 'beef' || a.type === 'pork'));
  const hasElectricity = activities.some(a => a.category === 'electricity');

  if (hasTransport && hasFood) {
    return "I notice you drive and eat red meat regularly. You could significantly reduce your footprint by trying 'Meatless Mondays' and opting for public transit or carpooling just one day a week! 🌍";
  } else if (hasTransport) {
    return "Transportation seems to be a major part of your footprint. Consider swapping short car trips (under 3km) for biking or walking — it's great for your health and the planet! 🚲";
  } else if (hasFood) {
    return "A large portion of your footprint comes from food. Swapping beef for chicken, or trying plant-based meals a few times a week can drastically lower your emissions. 🥗";
  } else if (hasElectricity) {
    return "To lower your electricity footprint, try unplugging phantom energy drainers (like chargers not in use) and switching to LED bulbs. 💡";
  }

  return "You're doing great! Keep tracking your activities. Consistent tracking is the first step to making lasting, sustainable changes to your lifestyle. 🌟";
}

/**
 * Fallback static insights for the Simulator
 */
export async function getSimulatorInsight(title, savings, yearlySavings) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const trees = Math.max(0, Math.round(yearlySavings / 21));
  return `By ${title.toLowerCase()}, you would save ${savings.toFixed(2)} kg CO₂ per trip. Over a year, that's ${yearlySavings.toFixed(0)} kg — equivalent to planting ${trees} trees! 🌳`;
}

/**
 * Offline rule-based chatbot for AIChat
 */
export async function sendChatMessage(message, contextData = {}) {
  // Simulate "typing" delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 500));

  const lowerMsg = message.toLowerCase();

  // Keyword matching
  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
    return "Hello there! 👋 I'm your offline Carbon Coach. I can help you with tips on reducing your carbon footprint, suggestions for greener transport, or ideas for eco-friendly meals. What would you like to know?";
  }

  if (lowerMsg.includes('transport') || lowerMsg.includes('car') || lowerMsg.includes('commute') || lowerMsg.includes('drive')) {
    return "🚗 **Transport Tips:**\n\n1. **Carpool:** Sharing a ride halves your footprint.\n2. **Public Transit:** Trains and buses are much more efficient per passenger.\n3. **Active Transport:** Biking or walking for trips under 3km produces 0 emissions!\n4. **Eco-driving:** Accelerate smoothly and keep your tires inflated to improve gas mileage.";
  }

  if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('meal') || lowerMsg.includes('beef') || lowerMsg.includes('meat')) {
    return "🥗 **Food & Diet Tips:**\n\n1. **Eat Lower on the Food Chain:** Plant-based foods generally have a much lower footprint than meat, especially beef and lamb.\n2. **Shop Local & Seasonal:** Reduces transportation emissions.\n3. **Reduce Waste:** Plan meals to avoid throwing away food (food waste is a huge source of methane).";
  }

  if (lowerMsg.includes('electricity') || lowerMsg.includes('power') || lowerMsg.includes('energy') || lowerMsg.includes('light')) {
    return "💡 **Energy Saving Tips:**\n\n1. **LED Bulbs:** They use 75% less energy than incandescents.\n2. **Phantom Loads:** Unplug electronics when not in use.\n3. **Thermostat:** Lower it by 1-2 degrees in winter, and raise it in summer.\n4. **Wash Cold:** Washing clothes in cold water saves the energy used to heat it.";
  }

  if (lowerMsg.includes('shopping') || lowerMsg.includes('buy') || lowerMsg.includes('clothes')) {
    return "🛍️ **Sustainable Shopping:**\n\n1. **Buy Second-hand:** Thrift stores and online resale shops give clothes a second life.\n2. **Quality over Quantity:** Buy things that last longer.\n3. **Bring Your Own:** Use reusable bags, bottles, and cups to reduce single-use plastics.";
  }

  if (lowerMsg.includes('how are you') || lowerMsg.includes('who are you')) {
    return "I'm EcoBot, your offline sustainability assistant! I run completely in your browser without needing an internet connection. I'm here to help you make greener choices. 🌱";
  }

  // Default response
  return "That's an interesting point! Since I'm currently running in offline mode, my knowledge is a bit limited. Try asking me for tips on **transport**, **food**, **electricity**, or **shopping**! 🌍";
}
