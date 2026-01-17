"""
TIME UTILITIES
==============
Helper functions for time-related operations:
- Convert duration to hours and minutes
- Format times for display
- Calculate time differences
- Parse time strings
"""

from datetime import datetime, timedelta
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class TimeUtils:
    """
    Utility class for time-related operations
    - All time helper functions are here
    - Makes code cleaner and easier to read
    """

    # ========== CONVERT DURATION TO HOURS AND MINUTES ==========

    @staticmethod
    def get_duration_in_hours_and_minutes(start_time, end_time):
        """
        Calculate duration between two times
        Return hours and minutes separately
        
        Arguments:
            start_time: Start datetime object
            end_time: End datetime object
        
        Returns:
            Dictionary with hours and minutes
            Example: {'hours': 1, 'minutes': 30, 'total_minutes': 90}
        """
        
        logger.info(f"Calculating duration from {start_time} to {end_time}")
        
        try:
            # Step 1: Calculate duration
            duration = end_time - start_time
            
            # Step 2: Get total seconds
            total_seconds = duration.total_seconds()
            
            # Step 3: Convert to hours
            hours = int(total_seconds // 3600)
            
            # Step 4: Convert remaining to minutes
            minutes = int((total_seconds % 3600) // 60)
            
            # Step 5: Get total minutes
            total_minutes = int(total_seconds // 60)
            
            # Step 6: Return as dictionary
            result = {
                'hours': hours,
                'minutes': minutes,
                'total_minutes': total_minutes,
                'total_seconds': int(total_seconds)
            }
            
            logger.info(f"Duration: {hours}h {minutes}m")
            
            return result
        
        except Exception as error:
            logger.error(f"Error calculating duration: {str(error)}")
            return {
                'hours': 0,
                'minutes': 0,
                'total_minutes': 0,
                'total_seconds': 0
            }

    # ========== FORMAT TIME FOR DISPLAY ==========

    @staticmethod
    def format_time_for_display(datetime_obj, format_string='%d-%m-%Y %H:%M:%S'):
        """
        Format datetime for human-readable display
        
        Formats:
        - Default: "17-01-2024 10:30:45"
        - Date only: "%d-%m-%Y"
        - Time only: "%H:%M:%S"
        - ISO: "%Y-%m-%d %H:%M:%S"
        
        Arguments:
            datetime_obj: Datetime object to format
            format_string: Python datetime format string
        
        Returns:
            Formatted string
        """
        
        logger.info(f"Formatting time: {datetime_obj}")
        
        try:
            # Step 1: Check if datetime object exists
            if datetime_obj is None:
                logger.warning("Datetime object is None")
                return "N/A"
            
            # Step 2: Format using provided format string
            formatted = datetime_obj.strftime(format_string)
            
            logger.info(f"Formatted: {formatted}")
            
            # Step 3: Return formatted string
            return formatted
        
        except Exception as error:
            logger.error(f"Error formatting time: {str(error)}")
            return "Invalid Date"

    # ========== GET TIME DIFFERENCE IN WORDS ==========

    @staticmethod
    def get_time_difference_in_words(past_time):
        """
        Get how long ago something happened
        
        Returns: "2 hours ago", "30 minutes ago", etc.
        
        Arguments:
            past_time: Datetime object from the past
        
        Returns:
            String like "2 hours ago"
        """
        
        logger.info(f"Calculating time difference from {past_time}")
        
        try:
            # Step 1: Get current time
            now = timezone.now()
            
            # Step 2: Calculate difference
            difference = now - past_time
            
            # Step 3: Get total seconds
            total_seconds = int(difference.total_seconds())
            
            # Step 4: Convert to appropriate unit
            if total_seconds < 60:
                return f"{total_seconds} seconds ago"
            
            # Minutes
            elif total_seconds < 3600:
                minutes = total_seconds // 60
                return f"{minutes} minutes ago"
            
            # Hours
            elif total_seconds < 86400:
                hours = total_seconds // 3600
                return f"{hours} hours ago"
            
            # Days
            else:
                days = total_seconds // 86400
                return f"{days} days ago"
        
        except Exception as error:
            logger.error(f"Error calculating time difference: {str(error)}")
            return "Unknown"

    # ========== GET CURRENT TIME ==========

    @staticmethod
    def get_current_time():
        """
        Get current time in timezone-aware format
        
        Returns:
            Current datetime object
        """
        
        try:
            # Step 1: Get current time (timezone-aware)
            current_time = timezone.now()
            
            logger.info(f"Current time: {current_time}")
            
            # Step 2: Return current time
            return current_time
        
        except Exception as error:
            logger.error(f"Error getting current time: {str(error)}")
            return None

    # ========== CHECK IF TIME IS WITHIN RANGE ==========

    @staticmethod
    def is_time_within_range(time_to_check, start_time, end_time):
        """
        Check if a time is between start and end times
        
        Arguments:
            time_to_check: Datetime to check
            start_time: Start datetime
            end_time: End datetime
        
        Returns:
            True if time is within range, False otherwise
        """
        
        logger.info(f"Checking if {time_to_check} is between {start_time} and {end_time}")
        
        try:
            # Step 1: Check if all times are provided
            if not all([time_to_check, start_time, end_time]):
                logger.warning("Missing time parameters")
                return False
            
            # Step 2: Check if time is within range
            is_within = start_time <= time_to_check <= end_time
            
            logger.info(f"Time is within range: {is_within}")
            
            # Step 3: Return result
            return is_within
        
        except Exception as error:
            logger.error(f"Error checking time range: {str(error)}")
            return False

    # ========== ADD TIME TO DATETIME ==========

    @staticmethod
    def add_time_to_datetime(datetime_obj, hours=0, minutes=0, seconds=0):
        """
        Add hours/minutes/seconds to a datetime
        
        Arguments:
            datetime_obj: Base datetime object
            hours: Hours to add (default: 0)
            minutes: Minutes to add (default: 0)
            seconds: Seconds to add (default: 0)
        
        Returns:
            New datetime object with added time
        """
        
        logger.info(f"Adding time to {datetime_obj}")
        
        try:
            # Step 1: Create timedelta with specified time
            time_to_add = timedelta(
                hours=hours,
                minutes=minutes,
                seconds=seconds
            )
            
            # Step 2: Add to datetime
            new_datetime = datetime_obj + time_to_add
            
            logger.info(f"New datetime: {new_datetime}")
            
            # Step 3: Return new datetime
            return new_datetime
        
        except Exception as error:
            logger.error(f"Error adding time: {str(error)}")
            return datetime_obj

    # ========== SUBTRACT TIME FROM DATETIME ==========

    @staticmethod
    def subtract_time_from_datetime(datetime_obj, hours=0, minutes=0, seconds=0):
        """
        Subtract hours/minutes/seconds from a datetime
        
        Arguments:
            datetime_obj: Base datetime object
            hours: Hours to subtract (default: 0)
            minutes: Minutes to subtract (default: 0)
            seconds: Seconds to subtract (default: 0)
        
        Returns:
            New datetime object with subtracted time
        """
        
        logger.info(f"Subtracting time from {datetime_obj}")
        
        try:
            # Step 1: Create timedelta with specified time
            time_to_subtract = timedelta(
                hours=hours,
                minutes=minutes,
                seconds=seconds
            )
            
            # Step 2: Subtract from datetime
            new_datetime = datetime_obj - time_to_subtract
            
            logger.info(f"New datetime: {new_datetime}")
            
            # Step 3: Return new datetime
            return new_datetime
        
        except Exception as error:
            logger.error(f"Error subtracting time: {str(error)}")
            return datetime_obj

    # ========== GET START AND END OF DAY ==========

    @staticmethod
    def get_start_of_day(date_obj=None):
        """
        Get start of day (00:00:00) for a date
        
        Arguments:
            date_obj: Date object (default: today)
        
        Returns:
            Datetime at start of day
        """
        
        try:
            # Step 1: If no date provided, use today
            if date_obj is None:
                date_obj = timezone.now().date()
            
            # Step 2: Create datetime at midnight
            start = timezone.make_aware(
                timezone.datetime.combine(date_obj, timezone.datetime.min.time())
            )
            
            logger.info(f"Start of day: {start}")
            
            # Step 3: Return start time
            return start
        
        except Exception as error:
            logger.error(f"Error getting start of day: {str(error)}")
            return None

    @staticmethod
    def get_end_of_day(date_obj=None):
        """
        Get end of day (23:59:59) for a date
        
        Arguments:
            date_obj: Date object (default: today)
        
        Returns:
            Datetime at end of day
        """
        
        try:
            # Step 1: If no date provided, use today
            if date_obj is None:
                date_obj = timezone.now().date()
            
            # Step 2: Create datetime at 23:59:59
            end = timezone.make_aware(
                timezone.datetime.combine(date_obj, timezone.datetime.max.time())
            )
            
            logger.info(f"End of day: {end}")
            
            # Step 3: Return end time
            return end
        
        except Exception as error:
            logger.error(f"Error getting end of day: {str(error)}")
            return None

    # ========== FORMAT DURATION AS STRING ==========

    @staticmethod
    def format_duration_as_string(hours, minutes, seconds=0):
        """
        Format duration as readable string
        
        Examples: "1h 30m", "45m", "2h", "30s"
        
        Arguments:
            hours: Number of hours
            minutes: Number of minutes
            seconds: Number of seconds (optional)
        
        Returns:
            Formatted string like "1h 30m 45s"
        """
        
        logger.info(f"Formatting duration: {hours}h {minutes}m {seconds}s")
        
        try:
            # Step 1: Build string parts
            parts = []
            
            # Add hours if any
            if hours > 0:
                parts.append(f"{hours}h")
            
            # Add minutes if any
            if minutes > 0:
                parts.append(f"{minutes}m")
            
            # Add seconds if any
            if seconds > 0:
                parts.append(f"{seconds}s")
            
            # Step 2: Join with space
            if parts:
                result = " ".join(parts)
            else:
                result = "0s"
            
            logger.info(f"Formatted duration: {result}")
            
            # Step 3: Return formatted string
            return result
        
        except Exception as error:
            logger.error(f"Error formatting duration: {str(error)}")
            return "Invalid Duration"
