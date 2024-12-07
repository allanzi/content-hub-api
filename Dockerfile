FROM public.ecr.aws/lambda/python:3.9

# Copy function code
COPY lambda_code.py ${LAMBDA_TASK_ROOT}

# Install dependencies if any
# COPY requirements.txt .
# RUN pip install -r requirements.txt

# Set the CMD to your handler (modify if needed)
CMD ["lambda_code.lambda_handler"]
