import { createServer } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createCheckoutSession } from "./actions";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stripe_price_id: string | null;
};

export default async function Home() {
  const supabase = await createServer();
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    return <p>Error loading products : {error.message}</p>;
  }
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Digital Marketplace
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video relative w-full">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.description}
              </p>
            </div>
            <div className="p-4 pt-0 flex justify-between items-center">
              <p className="text-lg font-semibold">${product.price}</p>

              {product.stripe_price_id && (
                <form
                  action={createCheckoutSession.bind(
                    null,
                    product.stripe_price_id,
                    product.id
                  )}
                >
                  <Button type="submit">Buy Now</Button>
                </form>
              )}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
