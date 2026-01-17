"""
RANDOM UTILITIES
================
Helper functions for generating random data:
- Generate random codes
- Generate random IDs
- Generate random strings
- Generate random numbers
"""

import random
import string
import uuid
import logging

logger = logging.getLogger(__name__)


class RandomUtils:
    """
    Utility class for generating random data
    - All random generation helper functions are here
    - Makes code cleaner and easier to read
    """

    # ========== GENERATE RANDOM CODE ==========

    @staticmethod
    def generate_random_code(length=10, include_numbers=True, include_letters=True):
        """
        Generate a random code with letters and numbers
        
        Arguments:
            length: Length of code (default: 10)
            include_numbers: Include digits 0-9 (default: True)
            include_letters: Include letters A-Z (default: True)
        
        Returns:
            Random code string
            Example: "ABC123DEF4"
        """
        
        logger.info(f"Generating random code with length {length}")
        
        try:
            # Step 1: Build character set
            characters = ""
            
            # Add letters if requested
            if include_letters:
                characters += string.ascii_uppercase
            
            # Add numbers if requested
            if include_numbers:
                characters += string.digits
            
            # Step 2: Check if we have characters
            if not characters:
                logger.warning("No character types selected")
                characters = string.ascii_uppercase + string.digits
            
            # Step 3: Generate random code
            code = ''.join(random.choice(characters) for _ in range(length))
            
            logger.info(f"Generated code: {code}")
            
            # Step 4: Return code
            return code
        
        except Exception as error:
            logger.error(f"Error generating random code: {str(error)}")
            return "ERROR"

    # ========== GENERATE RANDOM STRING ==========

    @staticmethod
    def generate_random_string(length=20):
        """
        Generate a random string (letters only, both cases)
        
        Arguments:
            length: Length of string (default: 20)
        
        Returns:
            Random string
            Example: "aBcDeFgHiJkLmNoPqRsT"
        """
        
        logger.info(f"Generating random string with length {length}")
        
        try:
            # Step 1: Create character set (upper + lower case letters)
            characters = string.ascii_letters
            
            # Step 2: Generate random string
            random_string = ''.join(random.choice(characters) for _ in range(length))
            
            logger.info(f"Generated string: {random_string}")
            
            # Step 3: Return string
            return random_string
        
        except Exception as error:
            logger.error(f"Error generating random string: {str(error)}")
            return "ERROR"

    # ========== GENERATE RANDOM NUMBER ==========

    @staticmethod
    def generate_random_number(min_value=0, max_value=999999):
        """
        Generate a random number within range
        
        Arguments:
            min_value: Minimum value (default: 0)
            max_value: Maximum value (default: 999999)
        
        Returns:
            Random integer
        """
        
        logger.info(f"Generating random number between {min_value} and {max_value}")
        
        try:
            # Step 1: Check values
            if min_value > max_value:
                logger.warning("Min value is greater than max value")
                min_value, max_value = max_value, min_value
            
            # Step 2: Generate random number
            random_number = random.randint(min_value, max_value)
            
            logger.info(f"Generated number: {random_number}")
            
            # Step 3: Return number
            return random_number
        
        except Exception as error:
            logger.error(f"Error generating random number: {str(error)}")
            return 0

    # ========== GENERATE UUID ==========

    @staticmethod
    def generate_uuid():
        """
        Generate a unique UUID (Universally Unique Identifier)
        
        Returns:
            UUID string
            Example: "550e8400-e29b-41d4-a716-446655440000"
        """
        
        logger.info("Generating UUID")
        
        try:
            # Step 1: Generate UUID4 (random UUID)
            unique_id = uuid.uuid4()
            
            # Step 2: Convert to string
            uuid_string = str(unique_id)
            
            logger.info(f"Generated UUID: {uuid_string}")
            
            # Step 3: Return UUID string
            return uuid_string
        
        except Exception as error:
            logger.error(f"Error generating UUID: {str(error)}")
            return ""

    # ========== GENERATE RANDOM SLOT NUMBER ==========

    @staticmethod
    def generate_random_slot_number(prefix="A"):
        """
        Generate a random parking slot number
        
        Arguments:
            prefix: Letter prefix for slot (default: "A")
        
        Returns:
            Slot number like "A001", "B042", etc.
        """
        
        logger.info(f"Generating random slot number with prefix {prefix}")
        
        try:
            # Step 1: Generate random number (001-999)
            slot_num = random.randint(1, 999)
            
            # Step 2: Format with leading zeros
            formatted_num = str(slot_num).zfill(3)
            
            # Step 3: Create slot number
            slot_number = f"{prefix}{formatted_num}"
            
            logger.info(f"Generated slot number: {slot_number}")
            
            # Step 4: Return slot number
            return slot_number
        
        except Exception as error:
            logger.error(f"Error generating slot number: {str(error)}")
            return "A000"

    # ========== GENERATE RANDOM VEHICLE NUMBER ==========

    @staticmethod
    def generate_random_vehicle_number():
        """
        Generate a random vehicle registration number
        
        Format: "XX-YY-ZZ-NNNN"
        Example: "KA-01-AB-1234"
        
        Returns:
            Vehicle number string
        """
        
        logger.info("Generating random vehicle number")
        
        try:
            # Step 1: Generate state code (2 letters)
            state = ''.join(random.choices(string.ascii_uppercase, k=2))
            
            # Step 2: Generate district (2 digits)
            district = str(random.randint(1, 99)).zfill(2)
            
            # Step 3: Generate series (2 letters)
            series = ''.join(random.choices(string.ascii_uppercase, k=2))
            
            # Step 4: Generate registration number (4 digits)
            reg_number = str(random.randint(1, 9999)).zfill(4)
            
            # Step 5: Combine all parts
            vehicle_number = f"{state}-{district}-{series}-{reg_number}"
            
            logger.info(f"Generated vehicle number: {vehicle_number}")
            
            # Step 6: Return vehicle number
            return vehicle_number
        
        except Exception as error:
            logger.error(f"Error generating vehicle number: {str(error)}")
            return "KA-01-AB-0000"

    # ========== GENERATE RANDOM PASSWORD ==========

    @staticmethod
    def generate_random_password(length=12):
        """
        Generate a strong random password
        
        Includes: Uppercase, lowercase, digits, special characters
        
        Arguments:
            length: Password length (default: 12)
        
        Returns:
            Strong password string
        """
        
        logger.info(f"Generating random password with length {length}")
        
        try:
            # Step 1: Define character sets
            uppercase = string.ascii_uppercase
            lowercase = string.ascii_lowercase
            digits = string.digits
            special = "!@#$%^&*"
            
            # All characters
            all_chars = uppercase + lowercase + digits + special
            
            # Step 2: Ensure at least one of each type
            password = [
                random.choice(uppercase),
                random.choice(lowercase),
                random.choice(digits),
                random.choice(special)
            ]
            
            # Step 3: Fill rest with random characters
            for _ in range(length - 4):
                password.append(random.choice(all_chars))
            
            # Step 4: Shuffle to avoid pattern
            random.shuffle(password)
            
            # Step 5: Join to string
            password_string = ''.join(password)
            
            logger.info(f"Generated password of length {length}")
            
            # Step 6: Return password
            return password_string
        
        except Exception as error:
            logger.error(f"Error generating password: {str(error)}")
            return "ERROR"

    # ========== PICK RANDOM ITEM FROM LIST ==========

    @staticmethod
    def pick_random_from_list(items_list):
        """
        Pick a random item from a list
        
        Arguments:
            items_list: List to pick from
        
        Returns:
            Random item from list, or None if empty
        """
        
        logger.info(f"Picking random item from list of {len(items_list)} items")
        
        try:
            # Step 1: Check if list is empty
            if not items_list:
                logger.warning("List is empty")
                return None
            
            # Step 2: Pick random item
            random_item = random.choice(items_list)
            
            logger.info(f"Picked random item: {random_item}")
            
            # Step 3: Return item
            return random_item
        
        except Exception as error:
            logger.error(f"Error picking random item: {str(error)}")
            return None

    # ========== SHUFFLE LIST ==========

    @staticmethod
    def shuffle_list(items_list):
        """
        Shuffle a list in random order
        
        Arguments:
            items_list: List to shuffle
        
        Returns:
            Shuffled list (new list, original unchanged)
        """
        
        logger.info(f"Shuffling list of {len(items_list)} items")
        
        try:
            # Step 1: Create copy of list
            shuffled = items_list.copy()
            
            # Step 2: Shuffle the copy
            random.shuffle(shuffled)
            
            logger.info("List shuffled successfully")
            
            # Step 3: Return shuffled list
            return shuffled
        
        except Exception as error:
            logger.error(f"Error shuffling list: {str(error)}")
            return items_list

    # ========== GENERATE RANDOM SAMPLE FROM LIST ==========

    @staticmethod
    def get_random_sample(items_list, sample_size):
        """
        Get random sample (multiple items) from a list
        
        Arguments:
            items_list: List to sample from
            sample_size: Number of items to pick
        
        Returns:
            List of random items
        """
        
        logger.info(f"Getting {sample_size} random items from list")
        
        try:
            # Step 1: Check if sample size is valid
            if sample_size > len(items_list):
                logger.warning("Sample size larger than list")
                sample_size = len(items_list)
            
            # Step 2: Get random sample
            sample = random.sample(items_list, sample_size)
            
            logger.info(f"Got {len(sample)} random items")
            
            # Step 3: Return sample
            return sample
        
        except Exception as error:
            logger.error(f"Error getting random sample: {str(error)}")
            return []
