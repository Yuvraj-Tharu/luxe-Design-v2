import { useGetAllDataQuery, useUpdateDataMutation } from "api/api";
import React, { Component, useEffect, useState } from "react";
import { Draggable } from "react-drag-reorder";

interface DragProps {
  handleReorder: () => void;
  entityName: string;
  refetch: () => Promise<any>;
}
function Drag({ handleReorder, entityName, refetch }: DragProps) {
  interface Item {
    id: string;
    name: string;
    displayPosition: number;
  }

  const [itemsIdAndDisplayPositionName, setItemsIdAndDisplayPositionName] =
    useState<Item[]>([]);
  const { data, isSuccess } = useGetAllDataQuery({ url: `/${entityName}` });
  const [reorder, { isLoading }] = useUpdateDataMutation();
  const getChangedPos = (currentPos: number, newPos: number) => {
    const updatedItems = [...itemsIdAndDisplayPositionName];
    const [movedItem] = updatedItems.splice(currentPos, 1); // Remove the dragged item
    updatedItems.splice(newPos, 0, movedItem); // Insert it at the new position

    // Update positions in the array
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      displayPosition: index + 1,
    }));

    setItemsIdAndDisplayPositionName(reorderedItems);
  };
  const handleCancel = () => {
    handleReorder();
  };

  const handleReorderSave = async () => {
    try {
      const response = await reorder({
        url: `/${entityName}/reorder`,
        updateData: itemsIdAndDisplayPositionName,
      });
      refetch();
      handleReorder();
    } catch (error) {
      console.error(error, "error");
    }
  };

  useEffect(() => {
    if (isSuccess && Array.isArray(data?.data?.records)) {
      const items = data.data.records.map((item: any) => ({
        id: item.id,
        name: item.name || item.title,
        displayPosition: item.displayPosition,
      }));
      setItemsIdAndDisplayPositionName(items);
    }
  }, [data, isSuccess]);

  return (
    <div className="flex-container">
      <div className="row">
        {itemsIdAndDisplayPositionName.length > 0 ? (
          <Draggable onPosChange={getChangedPos}>
            {itemsIdAndDisplayPositionName.map((item: any) => (
              <div key={item.id} className="flex-item">
                {item.name}
              </div>
            ))}
          </Draggable>
        ) : (
          <p>No items to display</p>
        )}
      </div>
      <button onClick={handleReorderSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default Drag;
