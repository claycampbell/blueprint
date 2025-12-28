"""Check BpmnWorkflowSerializer API."""

from SpiffWorkflow.bpmn.serializer.workflow import BpmnWorkflowSerializer
import inspect

print("=== BpmnWorkflowSerializer methods ===")
for name in dir(BpmnWorkflowSerializer):
    if not name.startswith('_') and 'serial' in name.lower():
        print(f"  {name}")

print("\n=== serialize_json signature ===")
print(inspect.signature(BpmnWorkflowSerializer.serialize_json))

print("\n=== deserialize_json signature ===")
print(inspect.signature(BpmnWorkflowSerializer.deserialize_json))

# Try serializing
from pathlib import Path
from SpiffWorkflow.bpmn.parser.BpmnParser import BpmnParser
from SpiffWorkflow.bpmn.workflow import BpmnWorkflow

BPMN_DIR = Path(__file__).parent / "bpmn"
bpmn_file = BPMN_DIR / "vs4_poc.bpmn"

parser = BpmnParser()
parser.add_bpmn_file(str(bpmn_file))
spec = parser.get_spec("VS4_DesignEntitlement_POC")
workflow = BpmnWorkflow(spec)
workflow.do_engine_steps()

serializer = BpmnWorkflowSerializer()

print("\n=== Serializing workflow ===")
serialized = serializer.serialize_json(workflow)
print(f"Type: {type(serialized)}")
print(f"First 200 chars: {str(serialized)[:200]}")
