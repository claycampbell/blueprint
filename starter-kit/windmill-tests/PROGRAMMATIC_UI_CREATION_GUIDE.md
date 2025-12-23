# Windmill Programmatic UI Creation Guide

## Summary

**SUCCESS:** We have proven that Windmill UIs can be created 100% programmatically via REST API!

## Key Discovery

The critical breakthrough was discovering the correct JSON structure for Windmill apps, particularly:
1. Grid layout requires BOTH "3" and "12" breakpoints (mobile and desktop)
2. Components need specific fields like `actionButtons: []` for tables
3. Configuration values must be typed objects: `{"type": "static", "value": ...}`

## Working Example

**Live Demo:** http://localhost:8000/apps/get/u/clay/blueprint_loan_dashboard

This fully functional dashboard was created entirely via Python + REST API with:
- Title header
- Summary statistics
- Data table with 5 loan records
- Footer attribution

## Required App Structure

```python
app_value = {
    "grid": [
        # Components array (see below)
    ],
    "theme": {
        "type": "path",
        "path": "f/app_themes/theme_0"
    },
    "subgrids": {},
    "fullscreen": False,
    "hideLegacyTopBar": True,
    "hiddenInlineScripts": [],
    "unusedInlineScripts": [],
    "mobileViewOnSmallerScreens": False
}
```

## Component Template

Every component in the grid array needs:

```python
{
    "3": {  # Mobile layout
        "h": 2,  # Height in grid units
        "w": 3,  # Width (3 = full width on mobile)
        "x": 0,  # X position
        "y": 0,  # Y position
        "fixed": False,
        "fullHeight": False
    },
    "12": {  # Desktop layout
        "h": 2,  # Height
        "w": 12,  # Width (12 = full width on desktop)
        "x": 0,
        "y": 0,
        "fixed": False,
        "fullHeight": False
    },
    "id": "unique_component_id",
    "data": {
        "id": "unique_component_id",  # Must match grid.id
        "type": "componenttype",
        "customCss": {
            "container": {"class": "", "style": ""}
            # Component-specific CSS objects
        },
        "configuration": {},  # Component-specific config
        "componentInput": {  # Data for the component
            "type": "static",
            "value": "..."
        }
        # Component-specific fields (see below)
    }
}
```

## Component Types

### Text Component

```python
{
    "id": "text1",
    "data": {
        "type": "textcomponent",
        "customCss": {
            "text": {"class": "text-xl font-bold", "style": ""},
            "container": {"class": "", "style": ""}
        },
        "configuration": {
            "style": {"type": "static", "value": "Title"}  # or "Body"
        },
        "componentInput": {
            "type": "static",
            "value": "Your text here"
        },
        "verticalAlignment": "center",  # top, center, bottom
        "horizontalAlignment": "left"   # left, center, right
    }
}
```

### Table Component

**CRITICAL:** Tables MUST have `"actionButtons": []` even if empty!

```python
{
    "id": "table1",
    "data": {
        "type": "tablecomponent",
        "customCss": {
            "container": {"class": "", "style": ""}
        },
        "actionButtons": [],  # REQUIRED - without this, table won't render!
        "configuration": {
            "search": {
                "type": "static",
                "value": "Auto",
                "fieldType": "select"
            },
            "pagination": {
                "type": "static",
                "value": {"auto": True, "size": 20}
            }
        },
        "componentInput": {
            "type": "static",
            "value": [
                {"col1": "data1", "col2": "data2"},
                {"col1": "data3", "col2": "data4"}
            ]
        }
    }
}
```

### Container Component

```python
{
    "id": "container1",
    "data": {
        "type": "containercomponent",
        "customCss": {
            "container": {"class": "p-4", "style": ""}
        },
        "configuration": {},
        "numberOfSubgrids": 1  # How many subgrids it contains
    }
}
```

Note: Containers need corresponding entries in `subgrids` object.

### Button Component

```python
{
    "id": "button1",
    "data": {
        "type": "buttoncomponent",
        "customCss": {
            "button": {"class": "", "style": ""},
            "container": {"class": "", "style": ""}
        },
        "configuration": {
            "label": {"type": "static", "value": "Click Me"},
            "color": {"type": "static", "value": "blue"},  # blue, red, green, etc.
            "size": {"type": "static", "value": "md"}  # sm, md, lg
        }
    }
}
```

## Available Components

From Windmill documentation, these components are available:

### Layout
- `containercomponent`
- `listcomponent`
- `drawercomponent`
- `splitpanescomponent`
- `modalcomponent`
- `steppercomponent`

### Tabs
- `tabscomponent`
- `conditionaltabscomponent`
- `sidebartabscomponent`

### Input
- `textinputcomponent`
- `textareacomponent`
- `numberinputcomponent`
- `dateinputcomponent`
- `togglecomponent`
- `selectcomponent`
- `multiselectcomponent`
- `fileuploadcomponent`
- `formcomponent`

### Display
- `textcomponent`
- `imagecomponent`
- `alertcomponent`
- `statisticcardcomponent`
- `htmlcomponent`

### Data
- `tablecomponent` (AgGrid)
- `listcomponent`

### Visualization
- `agchartscomponent`
- `chartjscomponent`
- `plotlycomponent`
- `vegalitecomponent`

### Other
- `buttoncomponent`
- `mapcomponent`
- `pdfcomponent`
- `databasestudiocomponent`

## Complete Working Script

See [create-final-dashboard.py](create-final-dashboard.py) for a complete example.

## API Endpoints

### Create App
```
POST /api/w/{workspace}/apps/create
{
  "path": "u/username/app_name",
  "summary": "App description",
  "value": {app_value},
  "policy": {
    "on_behalf_of": "u/username",
    "on_behalf_of_email": "user@example.com",
    "execution_mode": "publisher"
  }
}
```

### Delete App
```
DELETE /api/w/{workspace}/apps/delete/p/{path}
```

### Get App
```
GET /api/w/{workspace}/apps/get/p/{path}
```

### List Apps
```
GET /api/w/{workspace}/apps/list
```

## Best Practices

1. **Always include both "3" and "12" breakpoints** for responsive layout
2. **Match component IDs** - `grid.id` must equal `data.id`
3. **Check component-specific required fields** (like `actionButtons` for tables)
4. **Use typed configuration values** - `{"type": "static", "value": ...}`
5. **Include all metadata fields** - theme, subgrids, hideLegacyTopBar, etc.
6. **Test incrementally** - Start with text components, add complexity gradually
7. **Version control app JSON** - Export working apps as templates

## Workflow Recommendation

For Blueprint Connect 2.0:

1. **Design prototype in Windmill UI** - Use visual editor to experiment
2. **Export via API** - `GET /api/w/{workspace}/apps/get/p/{path}`
3. **Save as template** - Version control the JSON structure
4. **Modify programmatically** - Change data, IDs, positions as needed
5. **Deploy via API** - `POST /api/w/{workspace}/apps/create`

This hybrid approach gives you:
- Visual design benefits (see components instantly)
- Programmatic deployment (repeatable, version-controlled)
- Template reuse (modify for different use cases)

## Troubleshooting

### Blank Page
- Check browser console for JavaScript errors
- Verify all required fields are present
- Ensure grid layout has both "3" and "12" breakpoints
- Check component-specific required fields (e.g., `actionButtons` for tables)

### "Cannot read properties of undefined (reading 'length')"
- Usually means a required array field is missing
- For tables: Add `"actionButtons": []`
- For containers: Check `numberOfSubgrids` and `subgrids` object

### "Cannot set properties of undefined (setting 'fullHeight')"
- Missing "3" or "12" breakpoint in grid layout
- Ensure BOTH are present for every component

### App Creation Fails with 400
- App might already exist - delete first
- Check JSON structure matches expected format
- Verify authentication cookies are valid

## Files Created

### Working Examples
- [create-final-dashboard.py](create-final-dashboard.py) - Complete loan dashboard
- [create-simple-text-app.py](create-simple-text-app.py) - Minimal text app
- [create-app-with-table.py](create-app-with-table.py) - Table component example

### Reference
- [working-app-structure.json](working-app-structure.json) - Exported from u/clay/test
- [WINDMILL_UI_FINDINGS.md](WINDMILL_UI_FINDINGS.md) - Initial investigation
- [SESSION_SUMMARY.md](SESSION_SUMMARY.md) - Complete session notes

## Next Steps

1. ✅ Text components - WORKING
2. ✅ Table components - WORKING
3. ⬜ Chart components (Vega-Lite, AgCharts, etc.)
4. ⬜ Form components with validation
5. ⬜ Button components with actions
6. ⬜ Container components with subgrids
7. ⬜ Modal and drawer components
8. ⬜ Integration with backend scripts/flows

## Success Metrics

✅ **Proven:** Windmill UIs can be created 100% programmatically
✅ **Working:** Text and table components rendering correctly
✅ **Documented:** Complete component structure and requirements
✅ **Reusable:** Template scripts for future app creation

**Status:** Ready for Blueprint Connect 2.0 implementation!
