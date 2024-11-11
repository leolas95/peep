dbmigrate:
	npx prisma migrate dev --name="$(NAME)"

dry-dbmigrate:
	npx prisma migrate dev --create-only --name="$(NAME)"

apply-migration:
	npx prisma migrate dev

generate-client:
	npx prisma generate