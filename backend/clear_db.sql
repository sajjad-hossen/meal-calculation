-- Delete all Payment Requests
DELETE FROM "PaymentRequests";

-- Delete all Deposits
DELETE FROM "Deposits";

-- Delete all Bazar Costs
DELETE FROM "BazarCosts";

-- Delete all Meal Entries
DELETE FROM "Meals";

-- Delete all Users EXCEPT the specific admin
DELETE FROM "Users" WHERE "Email" != 'admin@messmgr.com';

-- Find the Mess IDs that the admin belongs to
-- Delete all Messes EXCEPT the one belonging to admin@messmgr.com
DELETE FROM "Messes" WHERE "Id" NOT IN (
    SELECT "MessId" FROM "Users" WHERE "Email" = 'admin@messmgr.com'
);
