"""
Jira automation utilities for DP01 project.

This module provides helper functions for interacting with Jira REST API.
"""

import os
import requests
from requests.auth import HTTPBasicAuth
from typing import Any

# Jira configuration
JIRA_BASE_URL = "https://vividcg.atlassian.net"
JIRA_API_URL = f"{JIRA_BASE_URL}/rest/api/3"


def get_jira_auth() -> HTTPBasicAuth:
    """Get Jira authentication from environment."""
    email = os.getenv("JIRA_EMAIL", "clay.campbell@vividcg.com")
    api_token = os.getenv("JIRA_API_TOKEN")

    if not api_token:
        raise ValueError("JIRA_API_TOKEN environment variable not set")

    return HTTPBasicAuth(email, api_token)


def get_issue(issue_key: str) -> dict[str, Any]:
    """
    Get Jira issue details.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")

    Returns:
        Issue data dictionary
    """
    url = f"{JIRA_API_URL}/issue/{issue_key}"
    response = requests.get(url, auth=get_jira_auth())
    response.raise_for_status()
    return response.json()


def transition_issue(issue_key: str, transition_id: str | int, comment: str | None = None) -> None:
    """
    Transition a Jira issue to a new status.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        transition_id: Transition ID (e.g., "311" for Code Review)
        comment: Optional comment to add with transition
    """
    url = f"{JIRA_API_URL}/issue/{issue_key}/transitions"

    payload = {
        "transition": {"id": str(transition_id)}
    }

    if comment:
        payload["update"] = {
            "comment": [{"add": {"body": comment}}]
        }

    response = requests.post(url, json=payload, auth=get_jira_auth())
    response.raise_for_status()


def update_issue(issue_key: str, fields: dict[str, Any]) -> None:
    """
    Update Jira issue fields.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        fields: Dictionary of fields to update
    """
    url = f"{JIRA_API_URL}/issue/{issue_key}"
    payload = {"fields": fields}

    response = requests.put(url, json=payload, auth=get_jira_auth())
    response.raise_for_status()


def add_comment(issue_key: str, comment: str) -> None:
    """
    Add a comment to a Jira issue.

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        comment: Comment text
    """
    url = f"{JIRA_API_URL}/issue/{issue_key}/comment"
    payload = {
        "body": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                    "type": "paragraph",
                    "content": [
                        {
                            "type": "text",
                            "text": comment
                        }
                    ]
                }
            ]
        }
    }

    response = requests.post(url, json=payload, auth=get_jira_auth())
    response.raise_for_status()


def create_remote_issue_link(
    issue_key: str,
    url: str,
    title: str,
    summary: str | None = None
) -> None:
    """
    Create a remote link to a Jira issue (e.g., link a GitHub PR).

    Args:
        issue_key: Jira issue key (e.g., "DP01-157")
        url: URL to link (e.g., GitHub PR URL)
        title: Link title
        summary: Optional link summary
    """
    api_url = f"{JIRA_API_URL}/issue/{issue_key}/remotelink"
    payload = {
        "object": {
            "url": url,
            "title": title
        }
    }

    if summary:
        payload["object"]["summary"] = summary

    response = requests.post(api_url, json=payload, auth=get_jira_auth())
    response.raise_for_status()
