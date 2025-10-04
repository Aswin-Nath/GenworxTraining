from utils.utils_05 import LoggerService

class UserService:
    def __init__(self, logger):
        self.logger = logger

    def create_user(self, name, email):
        self.logger.log_info(f"User '{name}' with email '{email}' has been created.")

    def delete_user(self, name):
        self.logger.log_info(f"User '{name}' has been deleted.")
logger = LoggerService()

user_service = UserService(logger)

user_service.create_user("Ragul KV", "ragul@example.com")
user_service.delete_user("Ragul KV")
