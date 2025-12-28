-- Fix Workflow Definition BPMN Data
-- This script populates workflow definitions with actual BPMN XML from files
-- INCLUDING DIAGRAM INFO (BPMNDiagram with shapes and edges for visual display)
--
-- Run this after migrate_workflow_definitions_v2.sql:
-- psql -U postgres -d workflow_poc -f fix_workflow_bpmn_data.sql

-- =============================================================================
-- STEP 1: Remove NOT NULL constraint from old bpmn_xml column (if still exists)
-- =============================================================================
ALTER TABLE workflow_definitions ALTER COLUMN bpmn_xml DROP NOT NULL;

-- =============================================================================
-- STEP 2: Update the existing VS4 parent workflow version with actual BPMN XML
-- =============================================================================
UPDATE workflow_definition_versions
SET bpmn_xml = '<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_VS4_POC"
                  targetNamespace="http://blueprint.dev/bpmn/vs4-poc">

  <bpmn:process id="VS4_DesignEntitlement_POC" name="VS4 Design and Entitlement POC" isExecutable="true">

    <bpmn:startEvent id="StartEvent" name="Start VS4">
      <bpmn:outgoing>Flow_Start_to_WFG1</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:callActivity id="WFG1_CallActivity" name="WFG1: Project Kickoff" calledElement="WFG1_ProjectKickoff">
      <bpmn:incoming>Flow_Start_to_WFG1</bpmn:incoming>
      <bpmn:incoming>Flow_WFG2_Back_to_WFG1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG1_to_Decision1</bpmn:outgoing>
    </bpmn:callActivity>

    <bpmn:exclusiveGateway id="Decision1" name="WFG1 Decision" default="Flow_WFG1_Approve_to_WFG2">
      <bpmn:incoming>Flow_WFG1_to_Decision1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG1_Approve_to_WFG2</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFG1_Skip_to_WFG3</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:callActivity id="WFG2_CallActivity" name="WFG2: Schematic Design" calledElement="WFG2_SchematicDesign">
      <bpmn:incoming>Flow_WFG1_Approve_to_WFG2</bpmn:incoming>
      <bpmn:incoming>Flow_WFG3_Back_to_WFG2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG2_to_Decision2</bpmn:outgoing>
    </bpmn:callActivity>

    <bpmn:exclusiveGateway id="Decision2" name="WFG2 Decision" default="Flow_WFG2_Approve_to_WFG3">
      <bpmn:incoming>Flow_WFG2_to_Decision2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG2_Approve_to_WFG3</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFG2_Back_to_WFG1</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:callActivity id="WFG3_CallActivity" name="WFG3: Construction Docs" calledElement="WFG3_ConstructionDocs">
      <bpmn:incoming>Flow_WFG2_Approve_to_WFG3</bpmn:incoming>
      <bpmn:incoming>Flow_WFG1_Skip_to_WFG3</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG3_to_Decision3</bpmn:outgoing>
    </bpmn:callActivity>

    <bpmn:exclusiveGateway id="Decision3" name="WFG3 Decision" default="Flow_WFG3_Approve_to_End">
      <bpmn:incoming>Flow_WFG3_to_Decision3</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG3_Approve_to_End</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFG3_Back_to_WFG2</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:endEvent id="EndEvent" name="VS4 Complete">
      <bpmn:incoming>Flow_WFG3_Approve_to_End</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="Flow_Start_to_WFG1" sourceRef="StartEvent" targetRef="WFG1_CallActivity"/>
    <bpmn:sequenceFlow id="Flow_WFG1_to_Decision1" sourceRef="WFG1_CallActivity" targetRef="Decision1"/>
    <bpmn:sequenceFlow id="Flow_WFG1_Approve_to_WFG2" name="approve" sourceRef="Decision1" targetRef="WFG2_CallActivity"/>
    <bpmn:sequenceFlow id="Flow_WFG1_Skip_to_WFG3" name="skip_to_wfg3" sourceRef="Decision1" targetRef="WFG3_CallActivity">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "skip_to" and target_step == "WFG3"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_WFG2_to_Decision2" sourceRef="WFG2_CallActivity" targetRef="Decision2"/>
    <bpmn:sequenceFlow id="Flow_WFG2_Approve_to_WFG3" name="approve" sourceRef="Decision2" targetRef="WFG3_CallActivity"/>
    <bpmn:sequenceFlow id="Flow_WFG2_Back_to_WFG1" name="send_back_wfg1" sourceRef="Decision2" targetRef="WFG1_CallActivity">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "send_back" and target_step == "WFG1"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_WFG3_to_Decision3" sourceRef="WFG3_CallActivity" targetRef="Decision3"/>
    <bpmn:sequenceFlow id="Flow_WFG3_Approve_to_End" name="approve" sourceRef="Decision3" targetRef="EndEvent"/>
    <bpmn:sequenceFlow id="Flow_WFG3_Back_to_WFG2" name="send_back_wfg2" sourceRef="Decision3" targetRef="WFG2_CallActivity">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "send_back" and target_step == "WFG2"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>

  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_VS4_POC">
    <bpmndi:BPMNPlane id="BPMNPlane_VS4_POC" bpmnElement="VS4_DesignEntitlement_POC">
      <bpmndi:BPMNShape id="StartEvent_di" bpmnElement="StartEvent">
        <dc:Bounds x="152" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_CallActivity_di" bpmnElement="WFG1_CallActivity">
        <dc:Bounds x="250" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Decision1_di" bpmnElement="Decision1" isMarkerVisible="true">
        <dc:Bounds x="415" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_CallActivity_di" bpmnElement="WFG2_CallActivity">
        <dc:Bounds x="530" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Decision2_di" bpmnElement="Decision2" isMarkerVisible="true">
        <dc:Bounds x="695" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG3_CallActivity_di" bpmnElement="WFG3_CallActivity">
        <dc:Bounds x="810" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Decision3_di" bpmnElement="Decision3" isMarkerVisible="true">
        <dc:Bounds x="975" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_di" bpmnElement="EndEvent">
        <dc:Bounds x="1092" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_Start_to_WFG1_di" bpmnElement="Flow_Start_to_WFG1">
        <di:waypoint x="188" y="210"/>
        <di:waypoint x="250" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG1_to_Decision1_di" bpmnElement="Flow_WFG1_to_Decision1">
        <di:waypoint x="350" y="210"/>
        <di:waypoint x="415" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG1_Approve_to_WFG2_di" bpmnElement="Flow_WFG1_Approve_to_WFG2">
        <di:waypoint x="465" y="210"/>
        <di:waypoint x="530" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG1_Skip_to_WFG3_di" bpmnElement="Flow_WFG1_Skip_to_WFG3">
        <di:waypoint x="440" y="235"/>
        <di:waypoint x="440" y="310"/>
        <di:waypoint x="860" y="310"/>
        <di:waypoint x="860" y="250"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG2_to_Decision2_di" bpmnElement="Flow_WFG2_to_Decision2">
        <di:waypoint x="630" y="210"/>
        <di:waypoint x="695" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG2_Approve_to_WFG3_di" bpmnElement="Flow_WFG2_Approve_to_WFG3">
        <di:waypoint x="745" y="210"/>
        <di:waypoint x="810" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG2_Back_to_WFG1_di" bpmnElement="Flow_WFG2_Back_to_WFG1">
        <di:waypoint x="720" y="185"/>
        <di:waypoint x="720" y="120"/>
        <di:waypoint x="300" y="120"/>
        <di:waypoint x="300" y="170"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG3_to_Decision3_di" bpmnElement="Flow_WFG3_to_Decision3">
        <di:waypoint x="910" y="210"/>
        <di:waypoint x="975" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG3_Approve_to_End_di" bpmnElement="Flow_WFG3_Approve_to_End">
        <di:waypoint x="1025" y="210"/>
        <di:waypoint x="1092" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG3_Back_to_WFG2_di" bpmnElement="Flow_WFG3_Back_to_WFG2">
        <di:waypoint x="1000" y="235"/>
        <di:waypoint x="1000" y="290"/>
        <di:waypoint x="580" y="290"/>
        <di:waypoint x="580" y="250"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>',
    change_notes = 'Updated with valid BPMN XML including diagram edges for visual display',
    is_active = TRUE
WHERE definition_id = 'a0000000-0000-0000-0000-000000000001';

-- Clear old bpmn_xml from the definitions table (now stored in versions)
UPDATE workflow_definitions
SET bpmn_xml = NULL
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- =============================================================================
-- STEP 3: Insert WFG1 - Project Kickoff workflow definition
-- =============================================================================
INSERT INTO workflow_definitions (id, name, description, process_id, status, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'WFG1: Project Kickoff',
    'Subprocess for Project Kickoff phase with Initial Project Review and Kickoff Meeting tasks',
    'WFG1_ProjectKickoff',
    'published',
    'system'
) ON CONFLICT (name) DO NOTHING;

-- Delete existing version if it exists (so we can update it)
DELETE FROM workflow_definition_versions WHERE definition_id = 'a0000000-0000-0000-0000-000000000002';

INSERT INTO workflow_definition_versions (definition_id, version, bpmn_xml, change_notes, is_active, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    1,
    '<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_WFG1"
                  targetNamespace="http://blueprint.dev/bpmn/wfg1">

  <bpmn:process id="WFG1_ProjectKickoff" name="WFG1: Project Kickoff" isExecutable="true">

    <bpmn:startEvent id="WFG1_Start" name="Start WFG1">
      <bpmn:outgoing>Flow_WFG1_Start_to_WFI1</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="WFG1_WFI1" name="WFI-1: Initial Project Review">
      <bpmn:incoming>Flow_WFG1_Start_to_WFI1</bpmn:incoming>
      <bpmn:incoming>Flow_WFI2_Back_to_WFI1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG1_WFI1_to_Gateway1</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="WFG1_Gateway1" name="WFI1 Decision" default="Flow_WFI1_to_WFI2">
      <bpmn:incoming>Flow_WFG1_WFI1_to_Gateway1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFI1_to_WFI2</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFI1_Complete_WFG</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:userTask id="WFG1_WFI2" name="WFI-2: Kickoff Meeting">
      <bpmn:incoming>Flow_WFI1_to_WFI2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG1_WFI2_to_Gateway2</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="WFG1_Gateway2" name="WFI2 Decision" default="Flow_WFI2_to_End">
      <bpmn:incoming>Flow_WFG1_WFI2_to_Gateway2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFI2_to_End</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFI2_Back_to_WFI1</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:endEvent id="WFG1_End" name="WFG1 Complete">
      <bpmn:incoming>Flow_WFI2_to_End</bpmn:incoming>
      <bpmn:incoming>Flow_WFI1_Complete_WFG</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="Flow_WFG1_Start_to_WFI1" sourceRef="WFG1_Start" targetRef="WFG1_WFI1"/>
    <bpmn:sequenceFlow id="Flow_WFG1_WFI1_to_Gateway1" sourceRef="WFG1_WFI1" targetRef="WFG1_Gateway1"/>
    <bpmn:sequenceFlow id="Flow_WFI1_to_WFI2" name="approve" sourceRef="WFG1_Gateway1" targetRef="WFG1_WFI2"/>
    <bpmn:sequenceFlow id="Flow_WFI1_Complete_WFG" name="complete_wfg" sourceRef="WFG1_Gateway1" targetRef="WFG1_End">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "complete_wfg"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_WFG1_WFI2_to_Gateway2" sourceRef="WFG1_WFI2" targetRef="WFG1_Gateway2"/>
    <bpmn:sequenceFlow id="Flow_WFI2_to_End" name="approve" sourceRef="WFG1_Gateway2" targetRef="WFG1_End"/>
    <bpmn:sequenceFlow id="Flow_WFI2_Back_to_WFI1" name="send_back_wfi1" sourceRef="WFG1_Gateway2" targetRef="WFG1_WFI1">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "send_back" and target_wfi == "WFI1"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>

  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_WFG1">
    <bpmndi:BPMNPlane id="BPMNPlane_WFG1" bpmnElement="WFG1_ProjectKickoff">
      <bpmndi:BPMNShape id="WFG1_Start_di" bpmnElement="WFG1_Start">
        <dc:Bounds x="152" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_WFI1_di" bpmnElement="WFG1_WFI1">
        <dc:Bounds x="250" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_Gateway1_di" bpmnElement="WFG1_Gateway1" isMarkerVisible="true">
        <dc:Bounds x="415" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_WFI2_di" bpmnElement="WFG1_WFI2">
        <dc:Bounds x="530" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_Gateway2_di" bpmnElement="WFG1_Gateway2" isMarkerVisible="true">
        <dc:Bounds x="695" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG1_End_di" bpmnElement="WFG1_End">
        <dc:Bounds x="812" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_WFG1_Start_to_WFI1_di" bpmnElement="Flow_WFG1_Start_to_WFI1">
        <di:waypoint x="188" y="210"/>
        <di:waypoint x="250" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG1_WFI1_to_Gateway1_di" bpmnElement="Flow_WFG1_WFI1_to_Gateway1">
        <di:waypoint x="350" y="210"/>
        <di:waypoint x="415" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI1_to_WFI2_di" bpmnElement="Flow_WFI1_to_WFI2">
        <di:waypoint x="465" y="210"/>
        <di:waypoint x="530" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI1_Complete_WFG_di" bpmnElement="Flow_WFI1_Complete_WFG">
        <di:waypoint x="440" y="235"/>
        <di:waypoint x="440" y="300"/>
        <di:waypoint x="830" y="300"/>
        <di:waypoint x="830" y="228"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG1_WFI2_to_Gateway2_di" bpmnElement="Flow_WFG1_WFI2_to_Gateway2">
        <di:waypoint x="630" y="210"/>
        <di:waypoint x="695" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI2_to_End_di" bpmnElement="Flow_WFI2_to_End">
        <di:waypoint x="745" y="210"/>
        <di:waypoint x="812" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI2_Back_to_WFI1_di" bpmnElement="Flow_WFI2_Back_to_WFI1">
        <di:waypoint x="720" y="185"/>
        <di:waypoint x="720" y="120"/>
        <di:waypoint x="300" y="120"/>
        <di:waypoint x="300" y="170"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>',
    'Version with diagram edges for visual display',
    TRUE,
    'system'
);

-- =============================================================================
-- STEP 4: Insert WFG2 - Schematic Design workflow definition
-- =============================================================================
INSERT INTO workflow_definitions (id, name, description, process_id, status, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'WFG2: Schematic Design',
    'Subprocess for Schematic Design phase with Design Development and Design Review tasks',
    'WFG2_SchematicDesign',
    'published',
    'system'
) ON CONFLICT (name) DO NOTHING;

-- Delete existing version if it exists (so we can update it)
DELETE FROM workflow_definition_versions WHERE definition_id = 'a0000000-0000-0000-0000-000000000003';

INSERT INTO workflow_definition_versions (definition_id, version, bpmn_xml, change_notes, is_active, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    1,
    '<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_WFG2"
                  targetNamespace="http://blueprint.dev/bpmn/wfg2">

  <bpmn:process id="WFG2_SchematicDesign" name="WFG2: Schematic Design" isExecutable="true">

    <bpmn:startEvent id="WFG2_Start" name="Start WFG2">
      <bpmn:outgoing>Flow_WFG2_Start_to_WFI1</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="WFG2_WFI1" name="WFI-1: Design Development">
      <bpmn:incoming>Flow_WFG2_Start_to_WFI1</bpmn:incoming>
      <bpmn:incoming>Flow_WFI2_Back_to_WFI1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG2_WFI1_to_Gateway1</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="WFG2_Gateway1" name="WFI1 Decision" default="Flow_WFI1_to_WFI2">
      <bpmn:incoming>Flow_WFG2_WFI1_to_Gateway1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFI1_to_WFI2</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFI1_Complete_WFG</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:userTask id="WFG2_WFI2" name="WFI-2: Design Review">
      <bpmn:incoming>Flow_WFI1_to_WFI2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG2_WFI2_to_Gateway2</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="WFG2_Gateway2" name="WFI2 Decision" default="Flow_WFI2_to_End">
      <bpmn:incoming>Flow_WFG2_WFI2_to_Gateway2</bpmn:incoming>
      <bpmn:outgoing>Flow_WFI2_to_End</bpmn:outgoing>
      <bpmn:outgoing>Flow_WFI2_Back_to_WFI1</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:endEvent id="WFG2_End" name="WFG2 Complete">
      <bpmn:incoming>Flow_WFI2_to_End</bpmn:incoming>
      <bpmn:incoming>Flow_WFI1_Complete_WFG</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="Flow_WFG2_Start_to_WFI1" sourceRef="WFG2_Start" targetRef="WFG2_WFI1"/>
    <bpmn:sequenceFlow id="Flow_WFG2_WFI1_to_Gateway1" sourceRef="WFG2_WFI1" targetRef="WFG2_Gateway1"/>
    <bpmn:sequenceFlow id="Flow_WFI1_to_WFI2" name="approve" sourceRef="WFG2_Gateway1" targetRef="WFG2_WFI2"/>
    <bpmn:sequenceFlow id="Flow_WFI1_Complete_WFG" name="complete_wfg" sourceRef="WFG2_Gateway1" targetRef="WFG2_End">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "complete_wfg"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_WFG2_WFI2_to_Gateway2" sourceRef="WFG2_WFI2" targetRef="WFG2_Gateway2"/>
    <bpmn:sequenceFlow id="Flow_WFI2_to_End" name="approve" sourceRef="WFG2_Gateway2" targetRef="WFG2_End"/>
    <bpmn:sequenceFlow id="Flow_WFI2_Back_to_WFI1" name="send_back_wfi1" sourceRef="WFG2_Gateway2" targetRef="WFG2_WFI1">
      <bpmn:conditionExpression xsi:type="tFormalExpression">decision_action == "send_back" and target_wfi == "WFI1"</bpmn:conditionExpression>
    </bpmn:sequenceFlow>

  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_WFG2">
    <bpmndi:BPMNPlane id="BPMNPlane_WFG2" bpmnElement="WFG2_SchematicDesign">
      <bpmndi:BPMNShape id="WFG2_Start_di" bpmnElement="WFG2_Start">
        <dc:Bounds x="152" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_WFI1_di" bpmnElement="WFG2_WFI1">
        <dc:Bounds x="250" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_Gateway1_di" bpmnElement="WFG2_Gateway1" isMarkerVisible="true">
        <dc:Bounds x="415" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_WFI2_di" bpmnElement="WFG2_WFI2">
        <dc:Bounds x="530" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_Gateway2_di" bpmnElement="WFG2_Gateway2" isMarkerVisible="true">
        <dc:Bounds x="695" y="185" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG2_End_di" bpmnElement="WFG2_End">
        <dc:Bounds x="812" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_WFG2_Start_to_WFI1_di" bpmnElement="Flow_WFG2_Start_to_WFI1">
        <di:waypoint x="188" y="210"/>
        <di:waypoint x="250" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG2_WFI1_to_Gateway1_di" bpmnElement="Flow_WFG2_WFI1_to_Gateway1">
        <di:waypoint x="350" y="210"/>
        <di:waypoint x="415" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI1_to_WFI2_di" bpmnElement="Flow_WFI1_to_WFI2">
        <di:waypoint x="465" y="210"/>
        <di:waypoint x="530" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI1_Complete_WFG_di" bpmnElement="Flow_WFI1_Complete_WFG">
        <di:waypoint x="440" y="235"/>
        <di:waypoint x="440" y="300"/>
        <di:waypoint x="830" y="300"/>
        <di:waypoint x="830" y="228"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG2_WFI2_to_Gateway2_di" bpmnElement="Flow_WFG2_WFI2_to_Gateway2">
        <di:waypoint x="630" y="210"/>
        <di:waypoint x="695" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI2_to_End_di" bpmnElement="Flow_WFI2_to_End">
        <di:waypoint x="745" y="210"/>
        <di:waypoint x="812" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFI2_Back_to_WFI1_di" bpmnElement="Flow_WFI2_Back_to_WFI1">
        <di:waypoint x="720" y="185"/>
        <di:waypoint x="720" y="120"/>
        <di:waypoint x="300" y="120"/>
        <di:waypoint x="300" y="170"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>',
    'Version with diagram edges for visual display',
    TRUE,
    'system'
);

-- =============================================================================
-- STEP 5: Insert WFG3 - Construction Docs workflow definition
-- =============================================================================
INSERT INTO workflow_definitions (id, name, description, process_id, status, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'WFG3: Construction Docs',
    'Subprocess for Construction Documents phase with Final Documentation task',
    'WFG3_ConstructionDocs',
    'published',
    'system'
) ON CONFLICT (name) DO NOTHING;

-- Delete existing version if it exists (so we can update it)
DELETE FROM workflow_definition_versions WHERE definition_id = 'a0000000-0000-0000-0000-000000000004';

INSERT INTO workflow_definition_versions (definition_id, version, bpmn_xml, change_notes, is_active, created_by)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    1,
    '<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_WFG3"
                  targetNamespace="http://blueprint.dev/bpmn/wfg3">

  <bpmn:process id="WFG3_ConstructionDocs" name="WFG3: Construction Docs" isExecutable="true">

    <bpmn:startEvent id="WFG3_Start" name="Start WFG3">
      <bpmn:outgoing>Flow_WFG3_Start_to_WFI1</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="WFG3_WFI1" name="WFI-1: Final Documentation">
      <bpmn:incoming>Flow_WFG3_Start_to_WFI1</bpmn:incoming>
      <bpmn:outgoing>Flow_WFG3_WFI1_to_End</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:endEvent id="WFG3_End" name="WFG3 Complete">
      <bpmn:incoming>Flow_WFG3_WFI1_to_End</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="Flow_WFG3_Start_to_WFI1" sourceRef="WFG3_Start" targetRef="WFG3_WFI1"/>
    <bpmn:sequenceFlow id="Flow_WFG3_WFI1_to_End" sourceRef="WFG3_WFI1" targetRef="WFG3_End"/>

  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_WFG3">
    <bpmndi:BPMNPlane id="BPMNPlane_WFG3" bpmnElement="WFG3_ConstructionDocs">
      <bpmndi:BPMNShape id="WFG3_Start_di" bpmnElement="WFG3_Start">
        <dc:Bounds x="152" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG3_WFI1_di" bpmnElement="WFG3_WFI1">
        <dc:Bounds x="250" y="170" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="WFG3_End_di" bpmnElement="WFG3_End">
        <dc:Bounds x="412" y="192" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_WFG3_Start_to_WFI1_di" bpmnElement="Flow_WFG3_Start_to_WFI1">
        <di:waypoint x="188" y="210"/>
        <di:waypoint x="250" y="210"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_WFG3_WFI1_to_End_di" bpmnElement="Flow_WFG3_WFI1_to_End">
        <di:waypoint x="350" y="210"/>
        <di:waypoint x="412" y="210"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>',
    'Version with diagram edges for visual display',
    TRUE,
    'system'
);

-- =============================================================================
-- STEP 6: Verify the data
-- =============================================================================
SELECT
    wd.name,
    wd.process_id,
    wd.status,
    wdv.version,
    wdv.is_active,
    LEFT(wdv.bpmn_xml, 80) as bpmn_preview
FROM workflow_definitions wd
LEFT JOIN workflow_definition_versions wdv ON wd.id = wdv.definition_id
ORDER BY wd.name;

DO $$
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'BPMN data fix complete!';
    RAISE NOTICE 'Created/updated 4 workflow definitions:';
    RAISE NOTICE '  - VS4 Design & Entitlement POC (parent)';
    RAISE NOTICE '  - WFG1: Project Kickoff';
    RAISE NOTICE '  - WFG2: Schematic Design';
    RAISE NOTICE '  - WFG3: Construction Docs';
    RAISE NOTICE '';
    RAISE NOTICE 'All workflows now include BPMNDiagram with:';
    RAISE NOTICE '  - BPMNShape elements for nodes';
    RAISE NOTICE '  - BPMNEdge elements with di:waypoint for lines';
    RAISE NOTICE '=========================================';
END $$;
