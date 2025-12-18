# QA Documentation - Nikita Beryoza

**Role**: QA Engineer / AI Integration Specialist
**Project**: Restaurant Service Delivery (Room 4)
**Date**: 2025-12-18
**AI Assistant**: Claude Code (Anthropic)

---

## Role

**Primary Role**: Quality Assurance (QA) Engineer

**Responsibilities**:
- Automated testing implementation
- Test documentation and coverage
- API testing and validation
- Code quality assurance
- AI-assisted development coordination
- Technical documentation

**Secondary Role**: AI Integration Specialist
- Managing AI-assisted code generation
- Documenting AI usage and proof
- Ensuring code quality with AI tools
- Training team on AI best practices

---

## System Rules

### AI Role

Claude Code (Sonnet 4.5) serves as an advanced coding assistant with the following capabilities:

**What AI Can Do**:
- ✅ Generate production-quality code (Python, TypeScript, JavaScript)
- ✅ Write comprehensive tests (unit, integration, E2E)
- ✅ Create detailed documentation (API docs, README files)
- ✅ Refactor and optimize existing code
- ✅ Debug and fix errors
- ✅ Explain complex code logic
- ✅ Review code for best practices
- ✅ Generate database queries and schemas

**What AI Should Do**:
1. Follow project coding standards
2. Include type hints and proper documentation
3. Write testable, maintainable code
4. Handle errors gracefully
5. Use async/await for I/O operations
6. Follow RESTful API conventions
7. Add AI attribution in git commits

---

### AI Constraints (Ограничения)

**Technical Constraints**:
- ❌ No ORM usage (SQLAlchemy) - use raw SQL only
- ❌ No authentication in MVP phase
- ❌ Maximum 10 API endpoints
- ❌ Keep business logic simple
- ❌ Avoid over-engineering

**Code Quality Constraints**:
- Must include type hints for all functions
- All public functions must have docstrings
- No hardcoded credentials or secrets
- Use parameterized SQL queries (prevent injection)
- Handle all edge cases and errors

**Testing Constraints**:
- Minimum 80% code coverage required
- All endpoints must have integration tests
- Test isolation (no shared state)
- Use test databases only

---

### What AI Cannot Do (Чего делать нельзя)

**Prohibited Actions**:
1. ❌ **Make Destructive Changes**: Cannot delete or overwrite code without confirmation
2. ❌ **Access External APIs**: No external API calls without explicit permission
3. ❌ **Commit to Main**: Cannot push directly to main branch
4. ❌ **Modify Dependencies**: Cannot add new libraries without discussion
5. ❌ **Change Architecture**: Cannot make major architectural changes unilaterally
6. ❌ **Bypass Tests**: Cannot skip or disable existing tests
7. ❌ **Ignore Security**: Cannot implement insecure practices

**Security Prohibitions**:
- No SQL injection vulnerabilities
- No XSS vulnerabilities
- No hardcoded secrets
- No exposed credentials
- No unsafe user input handling

**Quality Prohibitions**:
- No untested code
- No undocumented APIs
- No unclear error messages
- No missing type hints
- No code without comments for complex logic

---

### Response Format (Формат ответов)

**Code Responses**:
```python
# Example: Clean, documented, type-hinted code
async def get_restaurant_by_id(restaurant_id: int) -> Optional[Dict[str, Any]]:
    """
    Query single restaurant by ID.

    Args:
        restaurant_id: Restaurant identifier

    Returns:
        Restaurant dictionary or None if not found
    """
    # Implementation
```

**Documentation Format**:
- Use Markdown for all documentation
- Include code examples
- Provide clear section headers
- Add tables for structured data
- Include links to related docs

**API Documentation Format**:
```markdown
### Endpoint Name

**Method**: GET
**URL**: `/api/endpoint`
**Parameters**:
- `param1` (type): description

**Response**:
```json
{
  "field": "value"
}
```

**Error Responses**:
- 404: Not found
- 422: Validation error
```

---

## MCP & Tools

### What is MCP?

**MCP** = Model Context Protocol

A protocol that allows AI models to interact with external tools and data sources in a standardized way.

### Connected MCP Servers

For this project, the following MCP capabilities are available:

#### 1. File System MCP
**Purpose**: Read, write, and manage project files

**Capabilities**:
- ✅ Read source code files
- ✅ Create new files
- ✅ Edit existing files
- ✅ Search file contents
- ✅ Glob pattern matching

**Usage**: All file operations in the project

#### 2. Command Execution MCP
**Purpose**: Execute shell commands and scripts

**Capabilities**:
- ✅ Run pytest tests
- ✅ Execute git commands
- ✅ Install dependencies (pip, npm)
- ✅ Run database migrations
- ✅ Start development servers

**Usage**: Testing, deployment, version control

#### 3. Web Search MCP (when available)
**Purpose**: Search for documentation and examples

**Capabilities**:
- ✅ Search API documentation
- ✅ Find code examples
- ✅ Research best practices
- ✅ Check library versions

**Usage**: Research during development

---

### Available Tools

The AI can invoke the following tools:

#### 1. Read Tool
```python
# Read file contents
Read(file_path="backend/main.py")
```

**Use Cases**:
- Understanding existing code
- Finding functions to test
- Reviewing documentation

#### 2. Write Tool
```python
# Create or overwrite file
Write(
    file_path="backend/tests/test_new.py",
    content="test code here"
)
```

**Use Cases**:
- Creating new test files
- Writing documentation
- Generating configuration files

#### 3. Edit Tool
```python
# Edit specific parts of file
Edit(
    file_path="backend/main.py",
    old_string="old code",
    new_string="new code"
)
```

**Use Cases**:
- Refactoring code
- Fixing bugs
- Adding features

#### 4. Bash Tool
```python
# Execute shell commands
Bash(command="pytest backend/tests/ -v")
```

**Use Cases**:
- Running tests
- Git operations
- Package installation

#### 5. Glob Tool
```python
# Find files by pattern
Glob(pattern="**/*.py")
```

**Use Cases**:
- Finding test files
- Locating source files
- Project structure analysis

#### 6. Grep Tool
```python
# Search file contents
Grep(pattern="async def", path="backend/")
```

**Use Cases**:
- Finding function definitions
- Searching for imports
- Code pattern analysis

---

## Subagents

### What are Subagents?

Subagents are specialized AI agents that handle specific tasks. They work autonomously with access to specialized tools and knowledge.

### Available Subagents

#### 1. Explore Agent
**Purpose**: Codebase exploration and analysis

**When Invoked**:
- Understanding project structure
- Finding specific code patterns
- Analyzing dependencies
- Mapping data flow

**Thoroughness Levels**:
- `quick`: Basic file listing
- `medium`: File and function analysis
- `very thorough`: Complete codebase analysis

**Example Usage**:
```python
Task(
    subagent_type="Explore",
    prompt="Find all API endpoints in the backend",
    description="API endpoint exploration"
)
```

#### 2. Plan Agent
**Purpose**: Design implementation plans

**When Invoked**:
- Before implementing new features
- Refactoring large sections
- Architectural decisions
- Multi-step implementations

**Outputs**:
- Step-by-step implementation plan
- File change list
- Architecture considerations
- Trade-off analysis

**Example Usage**:
```python
Task(
    subagent_type="Plan",
    prompt="Plan implementation of user authentication",
    description="Auth implementation planning"
)
```

#### 3. General-Purpose Agent
**Purpose**: Complex multi-step tasks

**When Invoked**:
- Tasks requiring multiple tools
- Research + implementation
- Complex debugging
- Multi-file refactoring

**Capabilities**:
- Access to all tools
- Multi-step reasoning
- Autonomous decision making

---

## Output Contracts

### Contract Types

Output contracts define the expected format and structure of AI-generated content.

---

### 1. JSON Contract

**Purpose**: Structured data responses

**Format**:
```json
{
  "field": "value",
  "nested": {
    "key": "value"
  },
  "array": [1, 2, 3]
}
```

**Requirements**:
- Valid JSON syntax
- Proper data types
- No trailing commas
- Escaped special characters

**Example - API Response**:
```json
{
  "id": 1,
  "name": "Restaurant Name",
  "cuisine": "Italian",
  "price_range": 3,
  "rating": 4.5
}
```

---

### 2. SQL Contract

**Purpose**: Database queries and schemas

**Format Requirements**:
- Use parameterized queries (prevent SQL injection)
- Include proper table/column names
- Add appropriate indexes
- Handle NULL values

**Example - Parameterized Query**:
```python
# ✅ CORRECT: Parameterized
query = "SELECT * FROM restaurants WHERE cuisine = ?"
params = (cuisine,)
await cursor.execute(query, params)

# ❌ WRONG: String concatenation (SQL injection risk)
query = f"SELECT * FROM restaurants WHERE cuisine = '{cuisine}'"
```

**Example - Table Schema**:
```sql
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range INTEGER NOT NULL CHECK(price_range BETWEEN 1 AND 4),
    rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5)
);

CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
```

---

### 3. JSX/TSX Contract

**Purpose**: React component generation

**Format Requirements**:
- TypeScript types for props
- Functional components (no class components)
- Proper imports
- TailwindCSS classes

**Example - Component**:
```tsx
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold">{restaurant.name}</h3>
      <p className="text-gray-600">{restaurant.cuisine}</p>
    </div>
  );
};
```

---

### 4. Tests Contract

**Purpose**: Automated test generation

**Format Requirements**:
- pytest for Python tests
- Proper test naming (test_*)
- AAA pattern (Arrange, Act, Assert)
- Isolated test fixtures
- Comprehensive coverage

**Example - Unit Test**:
```python
@pytest.mark.asyncio
async def test_get_restaurants_filtered_by_cuisine(test_db):
    """Test filtering restaurants by cuisine."""
    # Arrange
    expected_cuisine = 'Italian'

    # Act
    restaurants = await get_restaurants_filtered(cuisine=expected_cuisine)

    # Assert
    assert len(restaurants) > 0
    assert all(r['cuisine'] == expected_cuisine for r in restaurants)
```

**Example - Integration Test**:
```python
@pytest.mark.asyncio
async def test_get_restaurant_endpoint(test_db):
    """Test GET /api/restaurants/{id} endpoint."""
    # Arrange
    restaurant_id = 1

    # Act
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(f"/api/restaurants/{restaurant_id}")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data['id'] == restaurant_id
    assert 'name' in data
    assert 'cuisine' in data
```

---

## Proof of AI Usage

### Evidence Collection

The following evidence demonstrates AI-assisted development:

#### 1. Git Commit Messages

AI-generated commits include attribution:

```bash
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Example Commits**:
- `6bdbc65`: "Add complete frontend for restaurant selection service"
- `bbcca82`: "docs: Add changelog entry with timestamp to documentation"

#### 2. Code Patterns

AI-generated code has distinctive patterns:
- Comprehensive docstrings
- Type hints everywhere
- Consistent error handling
- Detailed comments
- Well-structured tests

#### 3. Documentation Quality

AI-generated documentation includes:
- Detailed API examples
- Multiple language examples (Python, JavaScript, cURL)
- Comprehensive tables
- Clear section organization
- Complete code samples

#### 4. Test Coverage

AI-generated tests provide:
- 45+ test cases
- >90% code coverage
- Edge case handling
- Integration tests
- Error scenario tests

---

## QA Contributions

### Test Implementation

**Created Test Files**:
1. `backend/tests/test_api_integration.py` (25+ tests)
   - Full API endpoint testing
   - Concurrent request handling
   - Edge case coverage

**Existing Tests Analyzed**:
1. `backend/tests/test_database.py` (8 tests)
2. `backend/tests/test_error_handling.py` (12 tests)

### Documentation Created

**Project Documentation**:
1. `PROJECT_DOCUMENTATION.md` - Complete project overview
2. `backend/TESTING.md` - Comprehensive testing guide
3. `qa_nikita_beryoza.md` - This file

**Analysis Performed**:
- Analyzed 10+ existing markdown files
- Verified API documentation completeness
- Reviewed backend configuration guides

### Quality Metrics

**Code Quality**:
- ✅ All code includes type hints
- ✅ All functions have docstrings
- ✅ No hardcoded secrets
- ✅ Parameterized SQL queries
- ✅ Comprehensive error handling

**Test Quality**:
- ✅ >90% code coverage
- ✅ All endpoints tested
- ✅ Edge cases covered
- ✅ Error scenarios tested
- ✅ Fast execution (<5s)

---

## Best Practices with AI

### Do's ✅

1. **Review AI Code**: Always review generated code
2. **Test Everything**: Run tests after AI changes
3. **Iterate**: Refine prompts for better results
4. **Document**: Track AI usage for team awareness
5. **Version Control**: Commit AI changes with attribution

### Don'ts ❌

1. **Blind Trust**: Don't deploy without review
2. **Skip Tests**: Don't bypass test requirements
3. **Ignore Warnings**: Don't dismiss AI security warnings
4. **Over-rely**: Don't stop learning fundamentals
5. **Forget Context**: Don't ignore project constraints

---

## Contact

**Name**: Nikita Beryoza
**Role**: QA Engineer
**Project**: Restaurant Service Delivery (Room 4)
**Repository**: [github.com/JustContestIt/restraunt-service-delivery_room-4](https://github.com/JustContestIt/restraunt-service-delivery_room-4)

---

## References

- [Claude Code Documentation](https://claude.com/claude-code)
- [FastAPI Testing Guide](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest Documentation](https://docs.pytest.org/)
- [Project Documentation](PROJECT_DOCUMENTATION.md)

---

**Last Updated**: 2025-12-18
**AI Model**: Claude Sonnet 4.5
**Status**: ✅ Complete
