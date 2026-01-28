import asyncio
import logging
from datetime import datetime
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

import aiosqlite
from modules.werewolf.services.renown import RenownService
from modules.werewolf.models.renown import create_renown_table, RenownType, RenownStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VerifyFix")

async def test_renown_service():
    logger.info("Starting Renown Service Verification...")
    
    # 1. Setup In-Memory DB
    async with aiosqlite.connect(":memory:") as db:
        db.row_factory = aiosqlite.Row
        
        # 2. Create Table
        await create_renown_table(db)
        logger.info("Table 'werewolf_renown_requests' created.")
        
        # 3. Init Service
        service = RenownService(db)
        
        # 4. Test Submit Request
        user_id = "123456789"
        data = {
            "title": "Test Exploit",
            "description": "I defeated a bane spirit.",
            "type": "honor"
        }
        
        try:
            req = await service.submit_request(user_id, data)
            logger.info(f"Request submitted successfully: ID={req.id}, Title={req.title}")
            assert req.id is not None
            assert req.title == "Test Exploit"
            assert req.renown_type == RenownType.HONOR
            assert req.status == RenownStatus.PENDING
        except Exception as e:
            logger.error(f"Failed to submit request: {e}")
            raise

        # 5. Test Get All Requests (This was one of the broken queries)
        try:
            requests = await service.get_all_requests()
            logger.info(f"Retrieved {len(requests)} requests.")
            assert len(requests) == 1
            assert requests[0].id == req.id
            logger.info("Get All Requests query worked.")
        except Exception as e:
            logger.error(f"Failed to get all requests: {e}")
            raise
            
        # 6. Test Update Status (The other broken query)
        try:
            updated_req = await service.update_request_status(req.id, RenownStatus.APPROVED, "987654321")
            logger.info(f"Request updated to: {updated_req.status}")
            assert updated_req.status == RenownStatus.APPROVED
            logger.info("Update Status query worked.")
        except Exception as e:
            logger.error(f"Failed to update status: {e}")
            raise
            
    logger.info("✅ Verification SUCCESS: Service is using correct table names.")

if __name__ == "__main__":
    asyncio.run(test_renown_service())
