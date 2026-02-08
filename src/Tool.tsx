import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  useToolContext,
} from '@appmirror/ui-kit';

/**
 * Main Tool Component
 *
 * This component is loaded by AppMirror via Module Federation.
 *
 * CSS Isolation Strategy:
 * - NO CSS import here (federated entry point)
 * - All styling via Tailwind utility classes (inherited from host)
 * - Tailwind utilities are automatically scoped by Vite CSS Modules
 * - ui-kit components loaded as singleton from host
 *
 * It receives context (auth, project, API) from the host app.
 *
 * Available context via useToolContext():
 * - projectId, projectName: Current project info
 * - userId, userEmail: Logged-in user info
 * - canEdit, canAdmin: Permission flags
 * - api: Pre-authenticated API client for READING from main database
 * - toolsDb: API client for READ/WRITE to custom tools database
 * - showToast: Show notifications
 * - navigate: Navigate within AppMirror
 *
 * Database Architecture:
 * - Use `api` to READ data from the main AppMirror database
 * - Use `toolsDb` to READ/WRITE tool-specific data to the custom tools database
 * - Example: Load project config with api.get(), save tool data with toolsDb.post()
 */
export default function Tool() {
  const {
    projectId,
    projectName,
    userId,
    userEmail,
    canEdit,
    api,
    toolsDb,
    showToast,
  } = useToolContext();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      showToast('Please enter a value', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Example: Save to custom tools database
      // Use toolsDb for writing tool-specific data
      // Note: Use snake_case for PostgreSQL column names
      await toolsDb.post('/your-tool-data', {
        project_id: projectId,  // snake_case for database columns
        user_id: userId,
        data: inputValue,
      });
      showToast('Saved successfully!', 'success');
      setInputValue('');
    } catch (error) {
      showToast('Failed to save', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Best Practices for API Usage:
   *
   * 1. Reading from main database (project config, user data, etc.):
   *    const config = await api.get('/config');
   *
   * 2. Saving tool-specific data to tools database (use snake_case):
   *    await toolsDb.post('/my-tool/data', {
   *      project_id: projectId,
   *      user_id: userId,
   *      value: 'example'
   *    });
   *
   * 3. Loading tool-specific data:
   *    const response = await toolsDb.get('/my-tool/data?projectId=' + projectId);
   *    const toolData = response.data; // Array of records
   *
   * 4. Updating tool data:
   *    await toolsDb.put('/my-tool/data/' + id, { value: 'updated' });
   *
   * 5. Deleting tool data:
   *    await toolsDb.delete('/my-tool/data/' + id);
   *
   * IMPORTANT: Use snake_case for PostgreSQL column names (project_id, user_id, created_at)
   * The backend will map these to the database columns correctly.
   */

  return (
    <div className="space-y-6 p-6 min-w-0 overflow-hidden text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tool</h1>
          <p className="text-muted-foreground">
            Working on: {projectName}
          </p>
        </div>
        <Badge variant={canEdit ? 'primary' : 'secondary'}>
          {canEdit ? 'Edit Access' : 'View Only'}
        </Badge>
      </div>

      {/* Context Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Context from AppMirror</CardTitle>
          <CardDescription>
            This data is provided by the host application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Project ID:</span> {projectId}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {userId}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userEmail}
          </div>
        </CardContent>
      </Card>

      {/* Main Feature Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feature Here</CardTitle>
          <CardDescription>
            Replace this with your tool's functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Enter something</Label>
            <Input
              id="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
              disabled={!canEdit}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canEdit || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
