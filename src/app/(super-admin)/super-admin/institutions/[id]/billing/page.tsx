type BillingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BillingPage({ params }: BillingPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Institution Billing</h1>
      <p className="text-sm text-muted-foreground">
        Billing for institution {id} — coming soon.
      </p>
    </div>
  );
}
