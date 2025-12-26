#!/bin/bash
cd /home/kavia/workspace/code-generation/movie-ticket-booking-interface-191201-191210/movie_booking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

