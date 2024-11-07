import { sendMoney } from '../../backend/src/TransactionService'; // Adjust path if necessary
import { logTransaction } from '../../backend/src/TransactionDAO'; // Adjust path if necessary
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


//AI Generated test without Jest

async function testSendMoney() {
    console.log("Initial test for sending money...");
    
    try {
      // Call sendMoney with plain document IDs, without "bankAccounts/" prefix
      await sendMoney("2dNP8AM5pZaYkAA72u4LVFa7zAh1", "HUs3KuWkGBadprCwyJ80JVAuNnD3", 1000, "Test transfer");
      console.log("Send money test completed successfully.");
    } catch (error) {
      console.error("Error during test:", error);
    }
  }
  
  testSendMoney();