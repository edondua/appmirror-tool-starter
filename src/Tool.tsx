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
 * It receives context (auth, project, API) from the host app.
 *
 * Available context via useToolContext():
 * - projectId, projectName: Current project info
 * - userId, userEmail: Logged-in user info
 * - canEdit, canAdmin: Permission flags
 * - api: Pre-authenticated API client (get, post, put, patch, delete)
 * - showToast: Show notifications
 * - navigate: Navigate within AppMirror
 */
export default function Tool() {
  const {
    projectId,
    projectName,
    userId,
    userEmail,
    canEdit,
    api,
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
      // Example API call using the pre-authenticated client
      // Replace with your actual endpoint
      await api.post('/api/your-endpoint', {
        projectId,
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tool</h1>
          <p className="text-muted-foreground">
            Working on: {projectName}
          </p>
        </div>
        <Badge variant={canEdit ? 'default' : 'secondary'}>
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
