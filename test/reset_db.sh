rm db/homes.csv
rm db/login_records.csv
touch db/homes.csv
touch db/login_records.csv
echo "id,sentence,is_used,created_at" >> db/homes.csv
echo "1,すごいね！,False,2025-04-07 11:20:30" >> db/homes.csv
echo "hash,ip,home_id,created_at,has_posted" >> db/login_records.csv