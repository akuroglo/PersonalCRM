import { EmptyState } from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="min-h-screen bg-background">
      <EmptyState onAddContact={() => console.log("Add first contact")} />
    </div>
  );
}
