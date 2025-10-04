class LoggerService:
    def log_info(self, message):
        print(f" INFO: {message}")

    def log_error(self, message):
        print(f" ERROR: {message}")

    def log_success(self, message):
        print(f" SUCCESS: {message}")
