"""SpiffWorkflow integration service for workflow POC."""

from __future__ import annotations

import io
import json
import logging
import uuid
from pathlib import Path
from typing import TYPE_CHECKING

from SpiffWorkflow.bpmn.parser.BpmnParser import BpmnParser
from SpiffWorkflow.bpmn.serializer.workflow import BpmnWorkflowSerializer
from SpiffWorkflow.bpmn.workflow import BpmnWorkflow
from SpiffWorkflow.bpmn.specs.defaults import UserTask
from SpiffWorkflow.task import TaskState

if TYPE_CHECKING:
    from app.models.workflow import WorkflowDefinitionVersion

logger = logging.getLogger(__name__)

# Path to BPMN files (for backward compatibility)
BPMN_DIR = Path(__file__).parent.parent.parent / "bpmn"

# BPMN files to load (parent + subprocesses) - for backward compatibility
BPMN_FILES = [
    "vs4_poc.bpmn",           # Parent process
    "wfg1_project_kickoff.bpmn",   # WFG1 subprocess
    "wfg2_schematic_design.bpmn",  # WFG2 subprocess
    "wfg3_construction_docs.bpmn", # WFG3 subprocess
]

# Task ID patterns to extract WFG and WFI
# Format: WFG{n}_WFI{m} -> (WFG{n}, WFI{m})
# Also handle Call Activity names: WFG{n}_CallActivity -> (WFG{n}, None)
def parse_task_id(task_id: str) -> tuple[str | None, str | None]:
    """Parse task ID to extract WFG and WFI identifiers."""
    # Handle subprocess tasks like "WFG1_WFI1", "WFG2_WFI2"
    if "_WFI" in task_id:
        parts = task_id.split("_WFI")
        wfg = parts[0].replace("_", "")  # "WFG1_WFI1" -> "WFG1"
        wfi = f"WFI{parts[1]}" if len(parts) > 1 else None
        return wfg, wfi

    # Handle Call Activity tasks like "WFG1_CallActivity"
    if "_CallActivity" in task_id:
        wfg = task_id.replace("_CallActivity", "")
        return wfg, None

    # Handle legacy format "WFG1_ProjectKickoff" etc
    task_to_wfg = {
        "WFG1_ProjectKickoff": "WFG1",
        "WFG2_SchematicDesign": "WFG2",
        "WFG3_ConstructionDocs": "WFG3",
    }
    if task_id in task_to_wfg:
        return task_to_wfg[task_id], None

    return None, None


# WFI definitions per WFG (for display and counting)
WFG_WFIS: dict[str, list[dict]] = {
    "WFG1": [
        {"id": "WFI1", "name": "Initial Project Review"},
        {"id": "WFI2", "name": "Kickoff Meeting"},
    ],
    "WFG2": [
        {"id": "WFI1", "name": "Design Development"},
        {"id": "WFI2", "name": "Design Review"},
    ],
    "WFG3": [
        {"id": "WFI1", "name": "Final Documentation"},
    ],
}


class WorkflowService:
    """Service for managing SpiffWorkflow instances."""

    def __init__(self) -> None:
        """Initialize the workflow service."""
        self._parser: BpmnParser | None = None
        self._serializer = BpmnWorkflowSerializer()

    def _get_parser(self) -> BpmnParser:
        """Get or create the BPMN parser with loaded definitions (file-based, for backward compatibility)."""
        if self._parser is None:
            self._parser = BpmnParser()

            # Load all BPMN files (parent + subprocesses)
            for bpmn_filename in BPMN_FILES:
                bpmn_file = BPMN_DIR / bpmn_filename
                if bpmn_file.exists():
                    self._parser.add_bpmn_file(str(bpmn_file))
                    logger.info(f"Loaded BPMN file: {bpmn_file}")
                else:
                    logger.warning(f"BPMN file not found: {bpmn_file}")

        return self._parser

    def _create_parser_from_xml(self, bpmn_xml: str) -> BpmnParser:
        """Create a new parser from BPMN XML string."""
        parser = BpmnParser()
        # BpmnParser expects a file-like object for add_bpmn_xml
        parser.add_bpmn_xml(bpmn_xml)
        return parser

    def _get_subprocess_specs(self, parser: BpmnParser) -> dict:
        """Get all subprocess specs for Call Activities."""
        subprocess_specs = {}
        subprocess_names = ["WFG1_ProjectKickoff", "WFG2_SchematicDesign", "WFG3_ConstructionDocs"]

        for subprocess_name in subprocess_names:
            try:
                subprocess_specs[subprocess_name] = parser.get_spec(subprocess_name)
                logger.info(f"Loaded subprocess spec: {subprocess_name}")
            except Exception as e:
                logger.warning(f"Could not load subprocess spec {subprocess_name}: {e}")

        return subprocess_specs

    def create_workflow_instance(self) -> tuple[str, BpmnWorkflow, str, str | None]:
        """
        Create a new workflow instance using file-based BPMN (backward compatible).

        Returns:
            Tuple of (instance_id, workflow, current_wfg, current_wfi)
        """
        parser = self._get_parser()
        spec = parser.get_spec("VS4_DesignEntitlement_POC")
        subprocess_specs = self._get_subprocess_specs(parser)

        workflow = BpmnWorkflow(spec, subprocess_specs=subprocess_specs)

        # Run until we hit a user task
        workflow.do_engine_steps()

        # Generate unique instance ID
        instance_id = str(uuid.uuid4())

        # Get current step (WFG and WFI)
        current_wfg, current_wfi = self._get_current_position(workflow)

        logger.info(f"Created workflow instance {instance_id} at {current_wfg}/{current_wfi}")

        return instance_id, workflow, current_wfg, current_wfi

    def create_workflow_from_definition(
        self, version: WorkflowDefinitionVersion, process_id: str
    ) -> tuple[str, BpmnWorkflow, str, str | None]:
        """
        Create a new workflow instance from a database-stored definition.

        Args:
            version: The workflow definition version containing BPMN XML
            process_id: The BPMN process ID to instantiate

        Returns:
            Tuple of (instance_id, workflow, current_wfg, current_wfi)
        """
        parser = self._create_parser_from_xml(version.bpmn_xml)

        try:
            spec = parser.get_spec(process_id)
        except Exception as e:
            logger.error(f"Failed to get spec for process {process_id}: {e}")
            raise ValueError(f"Process '{process_id}' not found in BPMN definition") from e

        # Try to get subprocess specs if they exist in the XML
        subprocess_specs = self._get_subprocess_specs(parser)

        workflow = BpmnWorkflow(spec, subprocess_specs=subprocess_specs)

        # Run until we hit a user task
        workflow.do_engine_steps()

        # Generate unique instance ID
        instance_id = str(uuid.uuid4())

        # Get current step (WFG and WFI)
        current_wfg, current_wfi = self._get_current_position(workflow)

        logger.info(
            f"Created workflow instance {instance_id} from definition version {version.id} "
            f"at {current_wfg}/{current_wfi}"
        )

        return instance_id, workflow, current_wfg, current_wfi

    def validate_bpmn_xml(self, bpmn_xml: str, process_id: str | None = None) -> dict:
        """
        Validate BPMN XML content.

        Args:
            bpmn_xml: The BPMN XML string to validate
            process_id: Optional process ID to verify exists in the XML

        Returns:
            Dict with validation results:
            {
                "valid": bool,
                "errors": list[str],
                "process_ids": list[str],  # Found process IDs
                "warnings": list[str]
            }
        """
        result = {
            "valid": True,
            "errors": [],
            "process_ids": [],
            "warnings": [],
        }

        try:
            parser = self._create_parser_from_xml(bpmn_xml)

            # Get all process specs from the parser
            # Note: This is a simplified check - SpiffWorkflow's parser
            # stores specs in parser.process_parsers
            if hasattr(parser, "process_parsers"):
                result["process_ids"] = list(parser.process_parsers.keys())

            if process_id and process_id not in result["process_ids"]:
                result["valid"] = False
                result["errors"].append(
                    f"Process ID '{process_id}' not found in BPMN. "
                    f"Available processes: {result['process_ids']}"
                )

            # Try to get the spec to validate it parses correctly
            if process_id and result["valid"]:
                try:
                    parser.get_spec(process_id)
                except Exception as e:
                    result["valid"] = False
                    result["errors"].append(f"Failed to parse process: {e}")

        except Exception as e:
            result["valid"] = False
            result["errors"].append(f"Invalid BPMN XML: {e}")

        return result

    def serialize_workflow(self, workflow: BpmnWorkflow) -> dict:
        """Serialize workflow state to JSON-compatible dict."""
        json_str = self._serializer.serialize_json(workflow, use_gzip=False)
        return json.loads(json_str)

    def deserialize_workflow(self, serialized_state: dict | str) -> BpmnWorkflow:
        """Deserialize workflow from JSON-compatible dict or string."""
        # Handle both dict (new format) and string (legacy from before fix)
        if isinstance(serialized_state, str):
            json_str = serialized_state
        else:
            json_str = json.dumps(serialized_state)
        return self._serializer.deserialize_json(json_str, use_gzip=False)

    def _get_ready_user_tasks(self, workflow: BpmnWorkflow) -> list:
        """Get ready user tasks from workflow (SpiffWorkflow 3.x compatible)."""
        return [
            task for task in workflow.get_tasks()
            if task.state == TaskState.READY and isinstance(task.task_spec, UserTask)
        ]

    def _get_current_position(self, workflow: BpmnWorkflow) -> tuple[str | None, str | None]:
        """Get the current workflow position (WFG and WFI)."""
        ready_tasks = self._get_ready_user_tasks(workflow)
        if not ready_tasks:
            # Check if workflow is complete
            if workflow.is_completed():
                return "End", None
            return None, None

        task = ready_tasks[0]
        task_id = task.task_spec.name
        wfg, wfi = parse_task_id(task_id)

        logger.debug(f"Current task: {task_id} -> WFG={wfg}, WFI={wfi}")
        return wfg, wfi

    def _get_current_step(self, workflow: BpmnWorkflow) -> str | None:
        """Get the current workflow step (WFG ID) - backward compatible."""
        wfg, _ = self._get_current_position(workflow)
        return wfg

    def get_current_step(self, workflow: BpmnWorkflow) -> str | None:
        """Public method to get current step (WFG)."""
        return self._get_current_step(workflow)

    def get_current_position(self, workflow: BpmnWorkflow) -> tuple[str | None, str | None]:
        """Public method to get current position (WFG and WFI)."""
        return self._get_current_position(workflow)

    def get_wfi_info(self, wfg: str | None) -> list[dict]:
        """Get WFI definitions for a given WFG."""
        if not wfg or wfg == "End":
            return []
        return WFG_WFIS.get(wfg, [])

    def execute_decision(
        self,
        workflow: BpmnWorkflow,
        action: str,
        target_step: str | None = None,
        target_wfi: str | None = None,
    ) -> tuple[BpmnWorkflow, str | None, str | None]:
        """
        Execute a decision on the workflow.

        Args:
            workflow: The workflow instance
            action: Decision action (approve, send_back, skip_to, complete_wfg)
            target_step: Target WFG for send_back/skip_to at WFG level
            target_wfi: Target WFI for send_back within a WFG

        Returns:
            Tuple of (updated_workflow, new_wfg, new_wfi)
        """
        ready_tasks = self._get_ready_user_tasks(workflow)
        if not ready_tasks:
            logger.warning("No ready tasks to complete")
            wfg, wfi = self._get_current_position(workflow)
            return workflow, wfg, wfi

        task = ready_tasks[0]
        current_wfg, current_wfi = parse_task_id(task.task_spec.name)

        logger.info(
            f"Executing decision: action={action}, target_step={target_step}, "
            f"target_wfi={target_wfi}, current={current_wfg}/{current_wfi}"
        )

        # Set task data for the gateway conditions
        task.data["decision_action"] = action
        if target_step:
            task.data["target_step"] = target_step
        if target_wfi:
            task.data["target_wfi"] = target_wfi

        # Complete the user task
        workflow.run_task_from_id(task.id)

        # Run engine steps to process gateway and reach next user task
        workflow.do_engine_steps()

        new_wfg, new_wfi = self._get_current_position(workflow)
        logger.info(f"Decision complete: moved from {current_wfg}/{current_wfi} to {new_wfg}/{new_wfi}")

        return workflow, new_wfg, new_wfi

    def approve(self, workflow: BpmnWorkflow) -> tuple[BpmnWorkflow, str | None, str | None]:
        """Approve the current step and move forward."""
        return self.execute_decision(workflow, "approve")

    def send_back(
        self,
        workflow: BpmnWorkflow,
        target_step: str | None = None,
        target_wfi: str | None = None,
    ) -> tuple[BpmnWorkflow, str | None, str | None]:
        """Send back to a previous step (WFG) or WFI within current WFG."""
        return self.execute_decision(workflow, "send_back", target_step, target_wfi)

    def skip_to(
        self, workflow: BpmnWorkflow, target_step: str
    ) -> tuple[BpmnWorkflow, str | None, str | None]:
        """Skip to a future step."""
        return self.execute_decision(workflow, "skip_to", target_step)

    def complete_wfg(
        self, workflow: BpmnWorkflow
    ) -> tuple[BpmnWorkflow, str | None, str | None]:
        """Complete current WFG and move to next WFG (skipping remaining WFIs)."""
        return self.execute_decision(workflow, "complete_wfg")

    def is_completed(self, workflow: BpmnWorkflow) -> bool:
        """Check if workflow is completed."""
        return workflow.is_completed()


# Singleton instance
workflow_service = WorkflowService()
