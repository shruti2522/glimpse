from git import Repo
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import os
repo_name=""
repo = Repo.clone_from(
    'https://github.com/shubham21155102/flask-railway', to_path="./example_data/test_repo2"
)
branch = repo.head.reference
from langchain.document_loaders import GitLoader
loader = GitLoader(repo_path="./example_data/test_repo2/", branch=branch)
data = loader.load()
# print(data)
import json
# Assuming 'docs' contains the list of Document objects
# Convert each Document object to a dictionary representation
doc_dicts = []
for doc in data:
    doc_dict = {
        "page_content": doc.page_content,
        "metadata": doc.metadata
    }
    doc_dicts.append(doc_dict)
# Convert the list of dictionaries to a JSON string with indentation
formatted_json = json.dumps(doc_dicts, indent=4)
data = json.loads(formatted_json)

# Iterate through the list of dictionaries and extract the page_content field
text_list = [doc_dict["page_content"] for doc_dict in data]

# Combine the text snippets into a single text
combined_text = "\n\n".join(text_list)
# Print the combined text
print(combined_text)
raw_document_text = combined_text
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
# text_content = combined_text
import openai
from typing import List, Dict, Any
from pydantic import BaseModel
class EntityConfig(BaseModel):
    name: str
    label: str

class ExtractionConfig(BaseModel):
    extraction_type: str
    entities: List[EntityConfig]
#
# create a pydantnic model for the extraction config
class ExtractionConfigSchema(BaseModel):
    extraction_type: str
    entities: List[Dict[str, Any]]

    # validate the extraction config
    @classmethod
    def validate(cls, config):
        # entities must have with at least one entity
        if len(config['entities']) == 0:
            return False
        
        # entities must have a name and label
        for entity in config['entities']:
            if 'name' not in entity or 'label' not in entity:
                return False
extraction_config = ExtractionConfig(
    extraction_type='form_value_extraction',
    entities=[
        EntityConfig(name='item_no', label='ITEM NO.'),
        EntityConfig(name='description', label='DESCRIPTION')
    ]
)

# Define the extraction function
extraction_function = {
    'name': 'extract_all_key_information',
    'description': 'Extract all key information from the document',
    'parameters': {
        'type': 'object',
        'properties': {
            entity.label: {'type': 'string'} for entity in extraction_config.entities
        }
    }
}
function_call = 'create documentation'
functions = [extraction_function]
api_key = os.getenv("api_key")
print(api_key)
openai.api_key = api_key
response = openai.ChatCompletion.create(
     model = 'gpt-4',
     messages = [{'role': 'user', 'content': raw_document_text}],
     functions = functions,
     function_call = 'auto'
)
print(response)