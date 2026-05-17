import { useState } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSearch} role="search">
      <TextInput
        placeholder="Search products..."
        leftSection={<IconSearch size={16} aria-hidden="true" />}
        rightSection={
          <ActionIcon
            type="submit"
            aria-label="Search"
            variant="filled"
            color="blue"
          >
            <IconSearch size={16} />
          </ActionIcon>
        }
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        style={{ width: 400 }}
        aria-label="Search products"
      />
    </form>
  );
};
