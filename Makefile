dbmigrate:
	npx prisma migrate dev --name=$(NAME)

dry-dbmigrate:
	npx prisma migrate dev --name=$(NAME) --create-only

apply-migration:
	npx prisma migrate dev

generate-client:
	npx prisma generate